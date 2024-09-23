import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Counter.css';
import '../fonts.css';

import FixedBottomNavigation from '../components/FixedBottomNavigation';
import FormPropsTextFields from '../components/FormPropsTextFields';

const Modelling = ({ moll }) => {
  const [view, setView] = useState('techInput');
  const [localMoll, setLocalMoll] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedValues, setSelectedValues] = useState({});
  const [stateValues, setStateValues] = useState({
    tensileStrengthResult: '0',
    yieldStrengthResult: '0',
    elongationResult: '0',
    hardnessResult: '0',
    firstTemperature: '0',
    firstTime: '0',
    cooling: '0',
    secondTemperature: '0',
    secondTime: '0',
    agingTemperature: '0',
    agingTime: '0',
    al: '0',
    si: '0',
    cu: '0',
    sc: '0',
    fe: '0',
    mn: '0',
    mg: '0',
    zr: '0',
    sm: '0',
    zn: '0',
    ti: '0',
    sr: '0',
    ni: '0',
    ce: '0'
  });

  const [refreshList, setRefreshList] = useState(false);

  useEffect(() => {
    const filteredMoll = moll.filter(item => item.myPage === 'Y');
    setLocalMoll(filteredMoll);
  }, [moll]);

  const keysToShow = [
    { key: 'tensileStrengthResult', name: '인장강도' },
    { key: 'yieldStrengthResult', name: '항복강도' },
    { key: 'elongationResult', name: '연신율' },
    { key: 'hardnessResult', name: '경도' },
    { key: 'firstTemperature', name: '1차 용체화온도' },
    { key: 'firstTime', name: '1차 용체화 시간' },
    { key: 'cooling', name: '냉각' },
    { key: 'secondTemperature', name: '2차 용체화온도' },
    { key: 'secondTime', name: '2차 용체화 시간' },
    { key: 'agingTemperature', name: '시효온도' },
    { key: 'agingTime', name: '시효시간' }
  ];

  const keys = [
    { key: 'al', name: 'Al' },
    { key: 'si', name: 'Si' },
    { key: 'cu', name: 'Cu' },
    { key: 'sc', name: 'Sc' },
    { key: 'fe', name: 'Fe' },
    { key: 'mn', name: 'Mn' },
    { key: 'mg', name: 'Mg' },
    { key: 'zr', name: 'Zr' },
    { key: 'sm', name: 'Sm' },
    { key: 'zn', name: 'Zn' },
    { key: 'ti', name: 'Ti' },
    { key: 'sr', name: 'Sr' },
    { key: 'ni', name: 'Ni' },
    { key: 'ce', name: 'Ce' }
  ];

  const handleModeling = async () => {
    console.log('재학습 데이터:', JSON.stringify(stateValues, null, 2));
    

    try {
      await fetch('http://127.0.0.1:5002/upflask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stateValues),
      });
      alert('학습 데이터 업로드 완료.')
    } catch (error) {
      console.error('학습 데이터 전송 오류 : ', error);
    }
  };

  const handleOptionChange = (e) => {
    const selectedIdx = parseInt(e.target.value);
    const selectedItem = localMoll.find(item => item.outputIdx === selectedIdx);

    if (selectedItem) {
      const newValues = {};
      [...keysToShow, ...keys].forEach(({ key }) => {
        newValues[key] = selectedItem[key];
      });
      setSelectedValues(newValues);
      setStateValues({ ...stateValues, ...newValues });
    }
    setSelectedOption(selectedIdx);
  };

  const handleDataSubmitted = () => {
    setRefreshList(prev => !prev); // 리스트를 업데이트하도록 상태를 토글
  };

  const renderTable = () => {
    const rows = [];

    for (let i = 0; i < 5; i++) {
      const cells = [];
      for (let j = 0; j < 5; j++) {
        const index = i * 5 + j;
        let keyItem;
        if (index < keysToShow.length) {
          keyItem = keysToShow[index];
        } else if (index - keysToShow.length < keys.length) {
          keyItem = keys[index - keysToShow.length];
        }
        if (keyItem) {
          const { key, name } = keyItem;
          cells.push(
            <td key={index}>
              <div className="align-middle">
                <label htmlFor={key}>{name}</label>
                <div className="table-value">
                  {selectedValues[key] || '0'}
                </div>
                <input
                  type="text"
                  name={key}
                  className="table-text-group"
                  placeholder={selectedValues[key]}
                  value={stateValues[key] || ''}
                  onChange={({ target: { value } }) => {
                    setStateValues(prev => ({ ...prev, [key]: value }));
                  }}
                />
              </div>
            </td>
          );
        } else {
          cells.push(<td key={index}></td>);
        }
      }
      rows.push(<tr key={i}>{cells}</tr>);
    }

    return (
      <div className="container">
        <div className="table-responsive">
          <table className="table table-bordered text-center">
            <tbody>
              {rows}
            </tbody>
          </table>
          <div className="table-btn-container">
            <button type="submit" className="btn btn-primary" onClick={handleModeling}>확인</button>
          </div>
        </div>
      </div>
    );
  };

  const renderTechInput = () => {
    return (
      <>
        <form>
          <div className="option-select">
            <select id="techSelect" className="form-control" onChange={handleOptionChange} value={selectedOption}>
              <option value="">공법설정 선택</option>
              {localMoll.map(item => (
                <option key={item.outputIdx} value={item.outputIdx}>
                  인장강도 : {item.tensileStrengthResult} 항복강도 : {item.yieldStrengthResult} 경도 : {item.hardnessResult} 연신율 : {item.elongationResult}
                </option>
              ))}
            </select>
          </div>
        </form>
        {renderTable()}
      </>
    );
  };

  const renderContent = () => {
    switch (view) {
      case 'techInput':
        return renderTechInput();
      case 'modelBackup':
        return (
          <>
            <FormPropsTextFields onDataSubmitted={handleDataSubmitted} /> {}
            <FixedBottomNavigation refreshList={refreshList} /> {}
          </>
        );
      default:
        return <div>Invalid view</div>;
    }
  };

  return (
    <div className="counter-wrap">
      <div className="counter-area">
        <h1>ML 페이지</h1>
        <div className="counter-group">
          <button onClick={() => setView('techInput')} className="btn btn-primary">공법 입력</button>
          <button onClick={() => setView('modelBackup')} className="btn btn-primary">유지/보수</button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default Modelling;
