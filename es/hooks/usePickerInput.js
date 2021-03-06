import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import * as React from 'react';
import KeyCode from "rc-util/es/KeyCode";
import { addGlobalMouseDownEvent } from '../utils/uiUtil';
export default function usePickerInput(_ref) {
  var open = _ref.open,
      isClickOutside = _ref.isClickOutside,
      triggerOpen = _ref.triggerOpen,
      forwardKeyDown = _ref.forwardKeyDown,
      blurToCancel = _ref.blurToCancel,
      onSubmit = _ref.onSubmit,
      onCancel = _ref.onCancel,
      _onFocus = _ref.onFocus,
      _onBlur = _ref.onBlur;

  var _React$useState = React.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      typing = _React$useState2[0],
      setTyping = _React$useState2[1];

  var _React$useState3 = React.useState(false),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      focused = _React$useState4[0],
      setFocused = _React$useState4[1];
  /**
   * We will prevent blur to handle open event when user click outside,
   * since this will repeat trigger `onOpenChange` event.
   */


  var preventBlurRef = React.useRef(false);
  var inputProps = {
    onMouseDown: function onMouseDown() {
      setTyping(true);
      triggerOpen(true);
    },
    onKeyDown: function onKeyDown(e) {
      switch (e.which) {
        case KeyCode.ENTER:
          {
            if (!open) {
              triggerOpen(true);
            } else if (onSubmit() !== false) {
              setTyping(true);
            }

            e.preventDefault();
            return;
          }

        case KeyCode.TAB:
          {
            if (typing && open && !e.shiftKey) {
              setTyping(false);
              e.preventDefault();
            } else if (!typing && open) {
              if (!forwardKeyDown(e) && e.shiftKey) {
                setTyping(true);
                e.preventDefault();
              }
            }

            return;
          }

        case KeyCode.ESC:
          {
            setTyping(true);
            onCancel();
            return;
          }
      }

      if (!open && ![KeyCode.SHIFT].includes(e.which)) {
        triggerOpen(true);
      } else if (!typing) {
        // Let popup panel handle keyboard
        forwardKeyDown(e);
      }
    },
    onFocus: function onFocus(e) {
      setTyping(true);
      setFocused(true);

      if (_onFocus) {
        _onFocus(e);
      }
    },
    onBlur: function onBlur(e) {
      if (preventBlurRef.current || !isClickOutside(document.activeElement)) {
        preventBlurRef.current = false;
        return;
      }

      if (blurToCancel) {
        setTimeout(function () {
          if (isClickOutside(document.activeElement)) {
            onCancel();
          }
        }, 0);
      } else {
        triggerOpen(false);
      }

      setFocused(false);

      if (_onBlur) {
        _onBlur(e);
      }
    }
  }; // Global click handler

  React.useEffect(function () {
    return addGlobalMouseDownEvent(function (_ref2) {
      var target = _ref2.target;

      if (open) {
        if (!isClickOutside(target)) {
          preventBlurRef.current = true; // Always set back in case `onBlur` prevented by user

          window.setTimeout(function () {
            preventBlurRef.current = false;
          }, 0);
        } else if (!focused) {
          triggerOpen(false);
        }
      }
    });
  });
  return [inputProps, {
    focused: focused,
    typing: typing
  }];
}