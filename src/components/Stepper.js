// Stepper.js

'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TouchableOpacity, ViewPropTypes, TextInput, InputAccessoryView, Keyboard } from 'react-native';

import Theme from 'teaset/themes/Theme';
import Global from 'src/Global';
import { Platform } from 'react-native';

export default class Stepper extends Component {

  static propTypes = {
    ...ViewPropTypes,
    defaultValue: PropTypes.number,
    value: PropTypes.number,
    step: PropTypes.number,
    max: PropTypes.number,
    min: PropTypes.number,
    valueStyle: Text.propTypes.style,
    valueFormat: PropTypes.func, //(value)
    subButton: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    addButton: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    showSeparator: PropTypes.bool,
    disabled: PropTypes.bool,
    editable: PropTypes.bool,
    onChange: PropTypes.func, //(value)
    placeholder: PropTypes.string,
    fixed: PropTypes.number
  };

  static defaultProps = {
    ...View.defaultProps,
    defaultValue: 0,
    step: 1,
    subButton: '－',
    addButton: '＋',
    showSeparator: true,
    disabled: false,
    editable: true,
    placeholder: '',
    fixed: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value ? props.value : (props.defaultValue ? props.defaultValue : 0),
      height: null,
    };
  }

  get value() {
    return (this.props.value === undefined ? this.state.value : this.props.value);
  }

  onLayout(e) {
    if (this.state.height === null) {
      this.setState({
        height: e.nativeEvent.layout.height,
      });
    }
    this.props.onLayout && this.props.onLayout(e);
  }

  onSubButtonPress() {
    let { step, min, onChange, fixed } = this.props;
    let value = this.value;
    try {
      if (!(/[^,.-\d]/g.test(this.value.toString())) || this.value === '') {
        value = parseFloat(parseFloat(this.value.toString()).toFixed(fixed))
        if (isNaN(value)) {
          value = 0
        }
        value -= step;
        value = value.toFixed(fixed)
      }
    } catch (error) {

    }
    if (value < min) value = min;
    this.setState({ value });
    onChange && onChange(value);
  }

  onAddButtonPress() {
    let { step, max, onChange, fixed } = this.props;
    let value = this.value;
    try {
      if (!(/[^,.-\d]/g.test(this.value.toString())) || this.value === '') {
        value = parseFloat(parseFloat(this.value.toString()).toFixed(fixed))
        if (isNaN(value)) {
          value = 0
        }
        console.log({ value, step })
        value += step;
        value = value.toFixed(fixed)
      }
    } catch (error) {
      console.log({error})
    }

    if (value > max) value = max;
    this.setState({ value });
    onChange && onChange(value);
  }

  buildStyle() {
    let { style } = this.props;
    style = [{
      backgroundColor: Theme.stepperColor,
      borderColor: Theme.stepperBorderColor,
      borderWidth: Theme.stepperBorderWidth,
      borderRadius: Theme.stepperBorderRadius,
      flexDirection: 'row',
      alignItems: 'center',
      overflow: 'hidden',
    }].concat(style);
    return style;
  }

  renderSubButton() {
    let { subButton, disabled, editable, min } = this.props;

    let subDisabled = !editable || this.value <= min;
    let subOpacity = !disabled && subDisabled ? Theme.stepperDisabledOpacity : 1;

    if (!React.isValidElement(subButton)) {
      let btnStyle = {
        width: Theme.stepperButtonWidth,
        height: Theme.stepperButtonHeight,
        alignItems: 'center',
        justifyContent: 'center',
      };
      let btnTextStyle = {
        color: Theme.stepperBtnTextColor,
        fontSize: Theme.stepperBtnFontSize,
      };
      subButton = (
        <View style={btnStyle}>
          <Text style={btnTextStyle}>{subButton}</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity disabled={subDisabled} onPress={() => this.onSubButtonPress()}>
        <View style={{ opacity: subOpacity }}>
          {subButton}
        </View>
      </TouchableOpacity>
    );
  }

  renderAddButton() {
    let { addButton, disabled, editable, max } = this.props;

    let addDisabled = !editable || this.value >= max;
    let addOpacity = !disabled && addDisabled ? Theme.stepperDisabledOpacity : 1;

    let btnStyle = {
      width: Theme.stepperButtonWidth,
      height: Theme.stepperButtonHeight,
      alignItems: 'center',
      justifyContent: 'center',
    };
    let btnTextStyle = {
      color: Theme.stepperBtnTextColor,
      fontSize: Theme.stepperBtnFontSize,
    };
    if (!React.isValidElement(addButton)) {
      addButton = (
        <View style={btnStyle}>
          <Text style={btnTextStyle}>{addButton}</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity disabled={addDisabled} onPress={() => this.onAddButtonPress()}>
        <View style={{ opacity: addOpacity }}>
          {addButton}
        </View>
      </TouchableOpacity>
    );
  }

  renderValue() {
    let { valueStyle, valueFormat, placeholder, onChange, editable } = this.props;

    valueStyle = [{
      color: Theme.stepperTextColor,
      fontSize: Theme.stepperFontSize,
      textAlign: 'center',
      minWidth: Theme.stepperValueMinWidth,
      paddingHorizontal: Theme.stepperValuePaddingHorizontal,
    }].concat(valueStyle);

    return (
      <TextInput
        style={valueStyle}
        value={valueFormat ? valueFormat(this.value) : this.value}
        numberOfLines={1}
        underlineColorAndroid='#00000000'
        placeholder={placeholder}
        placeholderTextColor='#C4C4C4'
        keyboardType='decimal-pad'
        onChangeText={text => (text.length > 0 && text[text.length-1] === ',') ? onChange((text.substring(0, text.length - 1) + '.')) : onChange(text)}
        returnKeyLabel='Xong'
        inputAccessoryViewID='Xong'
        editable={editable}
        
      />
    );
  }

  render() {
    let { style, children, pointerEvents, opacity, defaultValue, value, step, max, min, valueStyle, valueFormat, subButton, addButton, showSeparator, disabled, editable, onLayout, onChange, ...others } = this.props; //disable View.onChange

    style = this.buildStyle();

    let separator;
    if (showSeparator) {
      let fs = StyleSheet.flatten(style);
      separator = <View style={{ backgroundColor: fs.borderColor, width: fs.borderWidth, height: this.state.height }} />;
    }

    return (
      <View
        style={style}
        pointerEvents={disabled ? 'none' : pointerEvents}
        opacity={disabled ? Theme.stepperDisabledOpacity : opacity}
        onLayout={e => this.onLayout(e)}
        {...others}
      >
        {this.renderSubButton()}
        {separator}
        {this.renderValue()}
        {separator}
        {this.renderAddButton()}
        {
          Platform.OS === 'ios' &&
          <InputAccessoryView nativeID="Xong">
            <View style={{ paddingHorizontal: 8, backgroundColor: 'white', flexDirection: 'row', width: '100%', height: 45, borderTopColor: '#eeeeee', borderTopWidth: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => Keyboard.dismiss()} style={{ paddingHorizontal: 8, height: '100%', justifyContent: 'center' }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: Global.MainColor }}>Xong</Text>
              </TouchableOpacity>
            </View>
          </InputAccessoryView>
        }
      </View>
    );
  }

}
