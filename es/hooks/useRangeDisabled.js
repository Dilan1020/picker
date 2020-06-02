import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import * as React from 'react';
import { getValue } from '../utils/miscUtil';
import { isSameDate } from '../utils/dateUtil';
import useWeekDisabled from './useWeekDisabled';
export default function useRangeDisabled(_ref) {
  var picker = _ref.picker,
      locale = _ref.locale,
      selectedValue = _ref.selectedValue,
      disabledDate = _ref.disabledDate,
      disabled = _ref.disabled,
      generateConfig = _ref.generateConfig;
  var startDate = getValue(selectedValue, 0);
  var endDate = getValue(selectedValue, 1);
  var disabledStartDate = React.useCallback(function (date) {
    if (disabledDate && disabledDate(date)) {
      return true;
    }

    if (disabled[1] && endDate) {
      return !isSameDate(generateConfig, date, endDate) && generateConfig.isAfter(date, endDate);
    }

    return false;
  }, [disabledDate, disabled[1], endDate]);
  var disableEndDate = React.useCallback(function (date) {
    if (disabledDate && disabledDate(date)) {
      return true;
    }

    if (startDate) {
      var compareStartDate = picker === 'week' ? generateConfig.addDate(startDate, -7) : startDate;
      return !isSameDate(generateConfig, date, compareStartDate) && generateConfig.isAfter(compareStartDate, date);
    }

    return false;
  }, [disabledDate, startDate, picker]); // Handle week date disabled

  var sharedWeekDisabledConfig = {
    generateConfig: generateConfig,
    locale: locale
  };

  var _useWeekDisabled = useWeekDisabled(_objectSpread(_objectSpread({}, sharedWeekDisabledConfig), {}, {
    disabledDate: disabledStartDate
  })),
      _useWeekDisabled2 = _slicedToArray(_useWeekDisabled, 1),
      disabledStartWeekDate = _useWeekDisabled2[0];

  var _useWeekDisabled3 = useWeekDisabled(_objectSpread(_objectSpread({}, sharedWeekDisabledConfig), {}, {
    disabledDate: disableEndDate
  })),
      _useWeekDisabled4 = _slicedToArray(_useWeekDisabled3, 1),
      disabledEndWeekDate = _useWeekDisabled4[0];

  if (picker === 'week') {
    return [disabledStartWeekDate, disabledEndWeekDate];
  }

  return [disabledStartDate, disableEndDate];
}