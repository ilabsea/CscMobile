import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';

import { Modal, Portal } from 'react-native-paper';
import { Text, Icon } from 'native-base';
import { useDispatch } from 'react-redux';
import { LocalizationContext } from '../Translations';
import { getAll } from '../../actions/votingCriteriaAction';

import { FontFamily } from '../../assets/stylesheets/theme/font';

import CloseButton from '../CloseButton';
import SaveButton from '../SaveButton';
import OutlinedButton from '../OutlinedButton';
import TextFieldInput from '../TextFieldInput';

import realm from '../../db/schema';

const FormModal = (props) => {
  const dispatch = useDispatch();
  const { translations } = useContext(LocalizationContext);
  const { criteria, visible } = props;
  const [points, setPoints] = useState([]);
  const [hasAction, setHasAction] = useState(false);

  let defaultPoints = criteria[criteria.currentFieldName] != null && !hasAction ? [...JSON.parse(criteria[criteria.currentFieldName])] : [];

  const onDismiss = () => {
    setHasAction(false);
    setPoints([]);
    !!props.onDismiss && props.onDismiss();
  }

  function submit() {
    let data = { uuid: criteria.uuid };
    let inputtedPoints = points.filter(note => note.length > 0);

    data[criteria.currentFieldName] = inputtedPoints.length == 0 ? null : JSON.stringify(inputtedPoints);

    realm.write(() => {
      realm.create('VotingCriteria', data, 'modified');
    });

    dispatch(getAll(criteria.scorecard_uuid));
    setHasAction(false);
    onDismiss();
  }

  function getPoints() {
    return points.length == 0 ? defaultPoints : points;
  }

  function addNewPoint() {
    let newPoints = getPoints();
    newPoints.push('');
    defaultPoints = [...defaultPoints ,...newPoints];

    setPoints([...newPoints]);
    setHasAction(true);
  }

  function deletePoint(index) {
    let newPoints = getPoints();
    newPoints.splice(index, 1);
    defaultPoints = newPoints;

    setPoints([...newPoints]);
    setHasAction(true);
  }

  function onChangeText(fieldName, value) {
    let index = fieldName.split('-')[1];
    let newPoints = getPoints();
    newPoints[index] = value;

    setPoints([...newPoints]);
  }

  function _renderForm() {
    let renderPoints = defaultPoints.length > 0 && points.length == 0 ? defaultPoints : points;

    return renderPoints.map((note, index) => {
      let fieldName = `note-${index}`;

      return (
        <View key={index} style={{flexDirection: 'row', flex: 1, width: '100%', alignItems: 'center'}}>
          <View style={{flex: 1}}>
            <TextFieldInput
              value={note}
              label={ translations[criteria.currentFieldName] }
              placeholder={ translations.enterNote }
              fieldName={fieldName}
              onChangeText={onChangeText}
              customStyle={{marginTop: -15}}
            />
          </View>

          <TouchableOpacity
            onPress={() => deletePoint(index)}
            style={{marginLeft: 20, marginTop: -45}}
          >
            <Icon name='trash' type="FontAwesome" style={{color: 'red', fontSize: 20}} />
          </TouchableOpacity>
        </View>
      )
    });
  }

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={ styles.container }>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={{flex: 1, backgroundColor: 'white'}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 24, fontFamily: FontFamily.title, marginBottom: 20, flex: 1}}>{translations.insert}{translations[criteria.currentFieldName]}</Text>

              <OutlinedButton
                icon='plus'
                label={ translations.addNew }
                onPress={() => addNewPoint() }
              />
            </View>

            <ScrollView
              contentContainerStyle={{borderWidth: 0, paddingTop: 20}}
              showsVerticalScrollIndicator={false}
            >
              { _renderForm() }
            </ScrollView>

            <View style={{flex: 1}}></View>
            <View style={styles.btnWrapper}>
              <CloseButton onPress={() => onDismiss()} label={translations.close} />
              <SaveButton onPress={() => submit()} label={translations.save} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Portal>
  )
}

export default FormModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    minHeight: 450,
    marginHorizontal: 30,
    justifyContent: 'flex-start'
  },
  btnWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
});
