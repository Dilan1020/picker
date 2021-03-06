import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Picker from '../src/Picker';
import dayjsGenerateConfig from '../src/generate/dayjs';
import zhCN from '../src/locale/zh_CN';
import enUS from '../src/locale/en_US';
import '../assets/index.less';

// const defaultValue = moment('2019-09-03 05:02:03');
const defaultValue = dayjs('2019-11-28 01:02:03');

export default () => {
  const [value, setValue] = React.useState<Dayjs | null>(defaultValue);
  const weekRef = React.useRef<Picker<Dayjs>>(null);

  const onSelect = (newValue: Dayjs) => {
    console.log('Select:', newValue);
  };

  const onChange = (newValue: Dayjs | null, formatString?: string) => {
    console.log('Change:', newValue, formatString);
    setValue(newValue);
  };

  const sharedProps = {
    generateConfig: dayjsGenerateConfig,
    value,
    onSelect,
    onChange,
  };

  return (
    <div>
      <h1>Value: {value ? value.format('YYYY-MM-DD HH:mm:ss') : 'null'}</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ margin: '0 8px' }}>
          <h3>Basic</h3>
          <Picker<Dayjs> {...sharedProps} locale={zhCN} />
          <Picker<Dayjs> {...sharedProps} locale={enUS} />
        </div>
        <div style={{ margin: '0 8px' }}>
          <h3>Uncontrolled</h3>
          <Picker<Dayjs>
            generateConfig={dayjsGenerateConfig}
            locale={zhCN}
            allowClear
            showToday
            renderExtraFooter={() => 'extra'}
          />
        </div>
        <div style={{ margin: '0 8px' }}>
          <h3>Datetime</h3>
          <Picker<Dayjs>
            {...sharedProps}
            locale={zhCN}
            defaultPickerValue={defaultValue.clone().subtract(1, 'month')}
            showTime={{
              showSecond: false,
              defaultValue: dayjs('11:28:39', 'HH:mm:ss'),
            }}
            showToday
            disabledTime={date => {
              if (date && date.isSame(defaultValue, 'date')) {
                return {
                  disabledHours: () => [1, 3, 5, 7, 9, 11],
                };
              }
              return {};
            }}
          />
        </div>
        <div style={{ margin: '0 8px' }}>
          <h3>Uncontrolled Datetime</h3>
          <Picker<Dayjs>
            format="YYYY-MM-DD HH:mm:ss"
            generateConfig={dayjsGenerateConfig}
            locale={enUS}
            showTime
          />
        </div>
        <div style={{ margin: '0 8px' }}>
          <h3>Week</h3>
          <Picker<Dayjs>
            {...sharedProps}
            locale={zhCN}
            allowClear
            picker="week"
            renderExtraFooter={() => 'I am footer!!!'}
            ref={weekRef}
          />

          <button
            type="button"
            onClick={() => {
              if (weekRef.current) {
                weekRef.current.focus();
              }
            }}
          >
            Focus
          </button>
        </div>
        <div style={{ margin: '0 8px' }}>
          <h3>Week</h3>
          <Picker<Dayjs> generateConfig={dayjsGenerateConfig} locale={enUS} picker="week" />
        </div>
        <div style={{ margin: '0 8px' }}>
          <h3>Quarter</h3>
          <Picker<Dayjs> generateConfig={dayjsGenerateConfig} locale={enUS} picker="quarter" />
        </div>
        <div style={{ margin: '0 8px' }}>
          <h3>Time</h3>
          <Picker<Dayjs> {...sharedProps} locale={zhCN} picker="time" />
        </div>
        <div style={{ margin: '0 8px' }}>
          <h3>Time 12</h3>
          <Picker<Dayjs> {...sharedProps} locale={zhCN} picker="time" use12Hours />
        </div>
        <div style={{ margin: '0 8px' }}>
          <h3>Year</h3>
          <Picker<Dayjs> {...sharedProps} locale={zhCN} picker="year" />
        </div>
        <div style={{ margin: '0 8px' }}>
          <h3>Keyboard navigation (Tab key) disabled</h3>
          <Picker<Dayjs> {...sharedProps} locale={enUS} tabIndex={-1} />
        </div>
      </div>
    </div>
  );
};
