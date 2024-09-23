import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from joblib import dump, load
import os
from datetime import datetime

app = Flask(__name__)

CORS_ORIGINS = ['http://localhost:3000']
CORS_METHODS = ['POST']
CORS_HEADERS = ['Content-Type']

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', ','.join(CORS_ORIGINS))
    response.headers.add('Access-Control-Allow-Methods', ','.join(CORS_METHODS))
    response.headers.add('Access-Control-Allow-Headers', ','.join(CORS_HEADERS))
    return response

# 랜덤 변동을 적용하는 함수
def apply_random_variation(value):
    random_factor = np.random.rand() * 0.1 - 0.05
    return value * (1 + random_factor)

# 예측된 특성값과 실제 결과를 결합하여 재학습 데이터 준비 함수
def augment_data_with_variation(upflask_features, actual_result, n=30):
    augmented_data = []

    # 실제 결과값을 포함하여 총 n개의 변동 데이터를 생성
    for _ in range(n):
        varied_result = actual_result.applymap(apply_random_variation)
        augmented_data.append(varied_result)

    # DataFrame으로 변환
    augmented_data_df = pd.concat(augmented_data, ignore_index=True)

    # 예측된 특성값과 결합
    X_new = pd.concat([upflask_features] * n, ignore_index=True)
    y_new = augmented_data_df

    return X_new, y_new

# 모델 업데이트 함수
def update_model_with_augmented_data(X_new, y_new):
    # 데이터 증식
    X_new = X_new.iloc[:, :4].values  # 데이터프레임의 첫 4개 열을 배열로 변환
    y_new = y_new.iloc[:, 4:].values  # 데이터프레임의 나머지 열을 배열로 변환

    # 모델 불러오기
    model = load('./models/materials_model.joblib')

    # 모델 재학습
    model.fit(X_new, y_new)

    # 모델 저장
    # 현재 날짜 가져오기
    current_date = datetime.now().strftime('%Y%m%d')
    
    # 기존에 저장된 모델 파일들 중 오늘 날짜로 저장된 파일들 찾기
    model_files = os.listdir('./models')
    today_model_indices = []
    for filename in model_files:
        if filename.startswith(f'materials_model_{current_date}'):
            try:
                index_part = filename.split('_')[-1].split('.')[0]
                today_model_indices.append(int(index_part))
            except (IndexError, ValueError):
                continue

    # 오늘 날짜로 저장된 파일이 있으면 가장 큰 번호를 찾음, 없으면 -1 설정
    if today_model_indices:
        latest_index = max(today_model_indices)
    else:
        latest_index = -1

    # 새로운 모델 파일 이름 생성
    new_model_filename = f'./models/materials_model_{current_date}_{latest_index + 1}.joblib'
    dump(model, new_model_filename)

@app.route('/upflask', methods=['POST'])
def upflask():
    try:
        data = request.json
        print('Received data:', data)
        
        # 데이터 전처리
        upflask_features = pd.DataFrame([{
            'tensileStrengthResult': float(data['tensileStrengthResult']),
            'yieldStrengthResult': float(data['yieldStrengthResult']),
            'elongationResult': float(data['elongationResult']),
            'hardnessResult': float(data['hardnessResult']),
            'firstTemperature': int(round(float(data['firstTemperature']), 0)),
            'firstTime': round(float(data['firstTime']), 1),
            'cooling': int(round(float(data['cooling']), 0)),
            'secondTemperature': int(round(float(data['secondTemperature']), 0)),
            'secondTime': round(float(data['secondTime']), 1),
            'agingTemperature': int(round(float(data['agingTemperature']), 0)),
            'agingTime': round(float(data['agingTime']), 1),
            'al': round(float(data['al']), 2),
            'si': round(float(data['si']), 2),
            'cu': round(float(data['cu']), 2),
            'sc': round(float(data['sc']), 2),
            'fe': round(float(data['fe']), 2),
            'mn': round(float(data['mn']), 2),
            'mg': round(float(data['mg']), 2),
            'zr': round(float(data['zr']), 2),
            'sm': round(float(data['sm']), 2),
            'zn': round(float(data['zn']), 2),
            'ti': round(float(data['ti']), 2),
            'sr': round(float(data['sr']), 2),
            'ni': round(float(data['ni']), 2),
            'ce': round(float(data['ce']), 2)
        }])

        print('upflask_features:', upflask_features)
        
        # 실제 결과를 얻는 코드 (예시로 upflask_features를 사용)
        actual_result = upflask_features.copy()

        # 모델 업데이트
        X_new, y_new = augment_data_with_variation(upflask_features, actual_result)
        update_model_with_augmented_data(X_new, y_new)

        # 응답
        return jsonify({'message': 'Model updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(port=5002, debug=True)
