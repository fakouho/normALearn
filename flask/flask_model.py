from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import joblib
from sklearn.preprocessing import StandardScaler
import MySQLdb
import os
from datetime import datetime

app = Flask(__name__)

# CORS 설정 - 보안상의 이유로 실제 배포시에는 특정 도메인만 허용하는 것이 좋습니다.
CORS_ORIGINS = ['http://localhost:3000']
CORS_METHODS = ['POST']
CORS_HEADERS = ['Content-Type']

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', ','.join(CORS_ORIGINS))
    response.headers.add('Access-Control-Allow-Methods', ','.join(CORS_METHODS))
    response.headers.add('Access-Control-Allow-Headers', ','.join(CORS_HEADERS))
    return response

# MySQL 연결 정보 설정
db = MySQLdb.connect(host="project-db-cgi.smhrd.com",    # MySQL 서버 호스트
                     user="normalearn",     # MySQL 사용자 이름
                     passwd="woogun12345",   # MySQL 비밀번호
                     db="normalearn",
                     port=3307)  # 사용할 데이터베이스 이름
cursor = db.cursor()

# 가장 최근의 모델 파일을 찾는 함수
def find_latest_model():
    model_files = os.listdir('./models')
    latest_model = None
    latest_date = None
    latest_index = -1

    for filename in model_files:
        if filename.startswith('materials_model_') and filename.endswith('.joblib'):
            parts = filename.split('_')
            try:
                file_date = datetime.strptime(parts[2], '%Y%m%d').date()
                file_index = int(parts[3].split('.')[0])

                if latest_model is None or file_date > latest_date or (file_date == latest_date and file_index > latest_index):
                    latest_model = filename
                    latest_date = file_date
                    latest_index = file_index
            except (IndexError, ValueError):
                continue

    return latest_model

# 최신 모델 파일 이름을 찾기
latest_model_file = find_latest_model()
if latest_model_file is None:
    raise FileNotFoundError("No model file found")

# 저장된 모델 로드
model = joblib.load(os.path.join('./models', latest_model_file))

# StandardScaler 객체 생성 및 모델 훈련에 사용된 데이터를 기반으로 학습
training_data = np.load('./models/training_data.npy')  # 훈련 데이터 파일 경로에 맞게 수정
scaler = StandardScaler()
scaler.fit(training_data)

# 특성 라벨
feature_labels = ['firstTemperature', 'firstTime', 'cooling', 'secondTemperature', 'secondTime', 'agingTemperature',
                  'agingTime', 'al', 'si', 'cu', 'sc', 'fe', 'mn', 'mg', 'zr', 'sm', 'zn', 'ti', 'sr', 'ni', 'ce']



@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    print("Received data:", data)  # 디버깅 메시지 추가

    if data is None:
        return jsonify({'error': 'Invalid input format'}), 400

    # 필수 입력 필드 확인
    required_fields = ['tensileStrength', 'yieldStrength', 'elongation', 'hardness']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400

    # 데이터 형식 확인 및 입력 데이터 표준화
    try:
        input_data = [float(data[field]) for field in required_fields[:4]]
        input_data = np.array(input_data).reshape(1, -1)
        
        input_data_df = pd.DataFrame(input_data, columns=required_fields[:4])
        input_data_scaled = scaler.transform(input_data_df)
    except ValueError as e:
        print(f"ValueError: {e}")  # ValueError 디버깅
        return jsonify({'error': 'Invalid data format'}), 400

    # 다양한 입력 데이터 변형하여 예측 결과 얻기
    results = []
    for _ in range(5):
        perturbed_input_data = input_data_scaled + np.random.normal(scale=0.1, size=input_data_scaled.shape)  # 입력 데이터를 약간 변형하여 다양한 결과 얻기
        prediction_scaled = model.predict(perturbed_input_data)
        prediction_dict = {feature_labels[i]: round(float(pred), 2) for i, pred in enumerate(prediction_scaled[0])}

        # 예측값에 대한 기계적 특성의 근삿값 포함
        mechanical_properties_approx = scaler.inverse_transform(perturbed_input_data)[0].tolist()
        mechanical_properties_approx_dict = {
            'tensileStrengthResult': round(mechanical_properties_approx[0], 2),
            'yieldStrengthResult': round(mechanical_properties_approx[1], 2),
            'elongationResult': round(mechanical_properties_approx[2], 2),
            'hardnessResult': round(mechanical_properties_approx[3], 2)
        }

        # 예측 결과와 기계적 특성을 하나의 딕셔너리로 결합
        combined_result = {**prediction_dict, **mechanical_properties_approx_dict}

        # 비정상적인 값을 필터링하거나 수정
        for key in combined_result:
            if combined_result[key] < 0:
                combined_result[key] = 0  # 음수 값을 0으로 설정

        results.append(combined_result)
        
    userId = data['userId']
    print(userId)
    tensileStrength = float(data['tensileStrength'])
    yieldStrength = float(data['yieldStrength'])
    hardness = float(data['hardness'])
    elongation = float(data['elongation'])
    

    print(f"Debug: tensileStrength={tensileStrength}, yieldStrength={yieldStrength}, hardness={hardness}, elongation={elongation}")

    inputquery = """INSERT INTO al_input (userId, tensileStrength, yieldStrength, hardness, elongation) 
                    VALUES (%s, %s, %s, %s, %s)"""
            
    cursor.execute(inputquery, (
            userId,
            tensileStrength,
            yieldStrength,
            hardness,
            elongation
        ))
    db.commit()
    cursor.execute("SELECT LAST_INSERT_ID()")
    input_insert_id = cursor.fetchone()[0]
    print(input_insert_id)
    
    # MySQL에 결과 삽입
    for result in results:
        try:

            # 결과를 삽입할 쿼리 작성
            outputquery = """INSERT INTO al_output (
                    userId, inputIdx, tensileStrengthResult, yieldStrengthResult, elongationResult, hardnessResult, 
                    firstTemperature, firstTime, cooling, secondTemperature, secondTime, agingTemperature, agingTime, 
                    al, si, cu, sc, fe, mn, mg, zr, sm, zn, ti, sr, ni, ce
                    ) VALUES (
                        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                    )"""
            # 쿼리를 실행하여 결과 삽입
            cursor.execute(outputquery, (
                userId,
                int(input_insert_id),
                round(result['tensileStrengthResult'], 2),
                round(result['yieldStrengthResult'], 2),
                round(result['elongationResult'], 2),
                round(result['hardnessResult'], 2),
                int(round(result['firstTemperature'], 0)),
                round(result['firstTime'], 1),
                int(round(result['cooling'], 0)),
                int(round(result['secondTemperature'], 0)),
                round(result['secondTime'], 1),
                int(round(result['agingTemperature'], 0)),
                round(result['agingTime'], 1),
                round(result['al'], 2),
                round(result['si'], 2),
                round(result['cu'], 2),
                round(result['sc'], 2),
                round(result['fe'], 2),
                round(result['mn'], 2),
                round(result['mg'], 2),
                round(result['zr'], 2),
                round(result['sm'], 2),
                round(result['zn'], 2),
                round(result['ti'], 2),
                round(result['sr'], 2),
                round(result['ni'], 2),
                round(result['ce'], 2)
            ))
            db.commit()
            cursor.execute("SELECT LAST_INSERT_ID()")
            output_insert_id = cursor.fetchone()[0]

            resultquery = """INSERT INTO al_result 
                        (resultIdx, userId, outputIdx, nickname, favorite, myPage) 
                        VALUES (%s ,%s, %s, %s, %s, %s)"""
            cursor.execute(resultquery,(
                int(output_insert_id),                
                userId,
                int(output_insert_id),
                'empty',
                'N',
                'N'
            ))
            db.commit()
            

        except Exception as e:
            db.rollback()  # 롤백
            print(f"Error db inserting prediction result: {e}")

    return jsonify({'results': results}), 200

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5001)