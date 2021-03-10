import React, { Component } from 'react';
import { View, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {LocalizationContext} from '../Translations';
import SelectPicker from '../SelectPicker';
import TextFieldInput from '../TextFieldInput';

import {localeDictionary} from '../../constants/locale_constant';

class SettingForm extends Component {
  static contextType = LocalizationContext
  constructor(props) {
    super(props);

    this.state = {
      backendUrl: 'https://isaf-stg.ilabsea.org',
      email: '',
      password: '',
      locales: [],
      locale: 'km',
      backendUrlErrorMsg: '',
      emailErrorMsg: '',
      passwordErrorMsg: '',
    };

    this.langugageController;
  }

  componentDidMount = async () => {
    const { appLanguage } = this.context;
    let setting = { locales: this.getLocales(), locale: appLanguage };

    try {
      const value = await AsyncStorage.getItem('SETTING');

      if (value !== null) {
        setting = Object.assign(setting, JSON.parse(value))
      }
      setting.locale = appLanguage;

      this.setState(setting);
    } catch (error) {
      this.setState(setting);
    }
  }

  getLocales = () => {
    const {translations} = this.context;
    let locales = translations.getAvailableLanguages();
    return locales.map((locale) => ({label: localeDictionary[locale], value: locale}));
  };

  closeDropDown = () => {
    this.languageController.close()
  }

  onChangeText = (fieldName, value) => {
    let state = {};
    state[fieldName] = value;
    state[`${fieldName}ErrorMsg`] = '';

    this.setState(state);
  }

  _renderForm = () => {
    const {translations} = this.context;
    const {backendUrl, email, password, backendUrlErrorMsg, emailErrorMsg, passwordErrorMsg} = this.state;
    const backendUrlLabel = `${translations['backendUrl']} *`;
    const emailLabel = `${translations['email']} *`;
    const passwordLabel = `${translations['password']} *`;

    return (
      <View>
        <TextFieldInput
          value={backendUrl}
          label={backendUrlLabel}
          placeholder={translations["enterBackendUrl"]}
          fieldName="backendUrl"
          onChangeText={this.onChangeText}
          message={translations[backendUrlErrorMsg]}
          onFocus={() => this.closeDropDown()}
        />

        <TextFieldInput
          value={email}
          label={emailLabel}
          placeholder={translations["enterEmail"]}
          fieldName="email"
          onChangeText={this.onChangeText}
          message={translations[emailErrorMsg]}
          onFocus={() => this.closeDropDown()}
        />

        <TextFieldInput
          value={password}
          label={passwordLabel}
          placeholder={translations["enterPassword"]}
          fieldName="password"
          onChangeText={this.onChangeText}
          message={translations[passwordErrorMsg]}
          secureTextEntry={true}
          onFocus={() => this.closeDropDown()}
        />
      </View>
    )
  }

  changeLocale = (locale) => {
    const {setAppLanguage} = this.context;
    this.setState({locale: locale.value});
    setAppLanguage(locale.value);
  }

  _renderChooseLanugage = () => {
    const {translations} = this.context;
    const {locales, locale} = this.state;

    return (
      <SelectPicker
        items={locales}
        selectedItem={locale}
        label={translations["language"]}
        placeholder={translations["selectLanguage"]}
        searchablePlaceholder={translations["searchForLanguage"]}
        zIndex={6000}
        showCustomArrow={true}
        onChangeItem={this.changeLocale}
        mustHasDefaultValue={true}
        controller={(instance) => this.languageController = instance}
        onOpen={() => Keyboard.dismiss()}
      />
    );
  };

  render() {
    return (
      <View>
        {this._renderForm()}
        {this._renderChooseLanugage()}
      </View>
    )
  }
}

export default SettingForm;