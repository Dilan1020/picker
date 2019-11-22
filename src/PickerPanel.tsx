/* eslint-disable jsx-a11y/no-noninteractive-tabindex */

import * as React from 'react';
import classNames from 'classnames';
import KeyCode from 'rc-util/lib/KeyCode';
import TimePanel, { SharedTimeProps } from './panels/TimePanel';
import DatetimePanel from './panels/DatetimePanel';
import DatePanel from './panels/DatePanel';
import WeekPanel from './panels/WeekPanel';
import MonthPanel from './panels/MonthPanel';
import YearPanel from './panels/YearPanel';
import DecadePanel from './panels/DecadePanel';
import { GenerateConfig } from './utils/generateUtil';
import { Locale, PanelMode, PanelRefProps } from './interface';
import { isEqual } from './utils/dateUtil';
import PanelContext from './PanelContext';

export interface PickerProps<DateType> {
  className?: string;
  style?: React.CSSProperties;
  prefixCls?: string;
  generateConfig: GenerateConfig<DateType>;
  value: DateType;
  /** [Legacy] Set default display picker view date */
  defaultPickerValue?: DateType;
  locale: Locale;
  mode?: PanelMode;
  showTime?: boolean | SharedTimeProps;
  tabIndex?: number;
  onSelect?: (value: DateType) => void;
  onChange?: (value: DateType) => void;
  onPanelChange?: (value: DateType, mode: PanelMode) => void;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
}

function Picker<DateType>(props: PickerProps<DateType>) {
  const {
    prefixCls = 'rc-picker',
    className,
    style,
    generateConfig,
    value,
    defaultPickerValue,
    mode,
    tabIndex = 0,
    showTime,
    onSelect,
    onChange,
    onPanelChange,
    onMouseDown,
  } = props;

  const { operationRef } = React.useContext(PanelContext);
  const panelRef = React.useRef<PanelRefProps>({});

  // Handle init logic
  const initRef = React.useRef(true);

  // View date control
  const [viewDate, setViewDate] = React.useState(
    defaultPickerValue || value || generateConfig.getNow(),
  );

  // Panel control
  const getNextMode = (nextMode: PanelMode): PanelMode => {
    if (nextMode === 'date' && showTime) {
      return 'datetime';
    }
    return nextMode;
  };

  const [innerMode, setInnerMode] = React.useState<PanelMode>(
    getNextMode('date'),
  );
  const mergedMode: PanelMode = mode || innerMode;

  const onInternalPanelChange = (newMode: PanelMode, viewValue: DateType) => {
    const nextMode = getNextMode(newMode);
    setInnerMode(nextMode);

    if (onPanelChange) {
      onPanelChange(viewValue, nextMode);
    }
  };

  const triggerSelect = (date: DateType) => {
    if (onSelect) {
      onSelect(date);
    }

    if (onChange && !isEqual(generateConfig, date, value)) {
      onChange(date);
    }
  };

  // ========================= Interactive ==========================
  const onInternalKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (panelRef.current && panelRef.current.onKeyDown) {
      if (
        [
          KeyCode.LEFT,
          KeyCode.RIGHT,
          KeyCode.UP,
          KeyCode.DOWN,
          KeyCode.PAGE_UP,
          KeyCode.PAGE_DOWN,
          KeyCode.ENTER,
        ].includes(e.which)
      ) {
        e.preventDefault();
      }
      return panelRef.current.onKeyDown(e);
    }
    return false;
  };

  const onInternalBlur: React.FocusEventHandler<HTMLElement> = e => {
    if (panelRef.current && panelRef.current.onBlur) {
      panelRef.current.onBlur(e);
    }
  };

  if (operationRef) {
    operationRef.current = {
      onKeyDown: onInternalKeyDown,
      onClose: () => {
        if (panelRef.current && panelRef.current.onClose) {
          panelRef.current.onClose();
        }
      },
    };
  }

  // ============================ Effect ============================
  React.useEffect(() => {
    if (value && !initRef.current) {
      setViewDate(value);
    }
  }, [value]);

  React.useEffect(() => {
    initRef.current = false;
  }, []);

  // ============================ Panels ============================
  let panelNode: React.ReactNode;

  const pickerProps = {
    ...props,
    operationRef: panelRef,
    prefixCls,
    viewDate,
    onViewDateChange: setViewDate,
    onPanelChange: onInternalPanelChange,
  };
  delete pickerProps.onSelect;

  switch (mergedMode) {
    case 'decade':
      panelNode = (
        <DecadePanel<DateType>
          {...pickerProps}
          onSelect={date => {
            setViewDate(date);
          }}
        />
      );
      break;

    case 'year':
      panelNode = (
        <YearPanel<DateType>
          {...pickerProps}
          onSelect={date => {
            setViewDate(date);
            triggerSelect(date);
          }}
        />
      );
      break;

    case 'month':
      panelNode = (
        <MonthPanel<DateType>
          {...pickerProps}
          onSelect={date => {
            setViewDate(date);
            triggerSelect(date);
          }}
        />
      );
      break;

    case 'week':
      panelNode = (
        <WeekPanel
          {...pickerProps}
          onSelect={date => {
            setViewDate(date);
            triggerSelect(date);
          }}
        />
      );
      break;

    case 'datetime':
      panelNode = (
        <DatetimePanel
          {...pickerProps}
          onSelect={date => {
            setViewDate(date);
            triggerSelect(date);
          }}
        />
      );
      break;

    case 'time':
      delete pickerProps.showTime;
      panelNode = (
        <TimePanel<DateType>
          {...pickerProps}
          {...(typeof showTime === 'object' ? showTime : null)}
          onSelect={date => {
            onInternalPanelChange('date', date);
            setViewDate(date);
            triggerSelect(date);
          }}
        />
      );
      break;

    default:
      panelNode = (
        <DatePanel<DateType>
          {...pickerProps}
          onSelect={date => {
            setViewDate(date);
            triggerSelect(date);
          }}
        />
      );
  }

  return (
    <div
      tabIndex={tabIndex}
      className={classNames(`${prefixCls}-panel`, className)}
      style={style}
      onKeyDown={onInternalKeyDown}
      onBlur={onInternalBlur}
      onMouseDown={onMouseDown}
    >
      {panelNode}
    </div>
  );
}

export default Picker;
/* eslint-enable */