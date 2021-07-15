import React, {useContext, useEffect} from 'react';

import { createStackNavigator, TransitionPresets, CardStyleInterpolators } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage'; // 1
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';


// Screens
import HomeScreen from '../screens/Home/Home';
import SettingScreen from '../screens/Setting/Setting';
import NewScorecardScreen from '../screens/NewScorecard/NewScorecard';
import ScorecardDetailScreen from '../screens/ScorecardDetail/ScorecardDetail';
import ScorecardPreferenceScreen from '../screens/ScorecardPreference/ScorecardPreference';
import FacilitatorScreen from '../screens/Facilitator/Facilitator';
import ScorecardListScreen from '../screens/ScorecardList/ScorecardList';
import ScorecardProgressScreen from '../screens/ScorecardProgress/ScorecardProgress';
import IndicatorDevelopmentScreen from '../screens/IndicatorDevelopment/IndicatorDevelopment';
import VotingCriteriaFormScreen from '../screens/VotingCriteriaForm/VotingCriteriaForm';
import VotingCriteriaListScreen from '../screens/VotingCriteriaList/VotingCriteriaList';
import RaisingProposedScreen from '../screens/RaisingProposed/RaisingProposed';
import CreateNewIndicatorScreen from '../screens/CreateNewIndicator/CreateNewIndicator';
import ScorecardResultScreen from '../screens/ScorecardResult/ScorecardResult';
import ParticipantListScreen from '../screens/ParticipantList/ParticipantList';
import AddNewParticipantScreen from '../screens/AddNewParticipant/AddNewParticipant';
import ParticipantInformationScreen from '../screens/ParticipantInformation/ParticipantInformation';
import ContactScreen from '../screens/Contact/Contact';
import AboutScreen from '../screens/About/About';
import SelectedImageScreen from '../screens/SelectedImage/SelectedImage';

import OfflineInstructionScreen from '../screens/OfflineInstruction/OfflineInstruction';
import FilterScorecardScreen from '../screens/FilterScorecard/FilterScorecard';

// Util and components
import Color from '../themes/color';
import { LocalizationContext } from '../components/Translations';
import SettingMenu from '../components/Home/SettingMenu';
import FilterButton from '../components/ScorecardList/FilterButton';
import { FontSize, FontFamily } from '../assets/stylesheets/theme/font';
import { getDeviceStyle, mobileHeadingTitleSize } from '../utils/responsive_util';
import { lgLabelSize } from '../constants/mobile_font_size_constant';

const Stack = createStackNavigator();

function AppNavigator() {
  const { translations, initializeAppLanguage } = useContext(LocalizationContext);

  useEffect(() => {
    initializeAppLanguage();
  });

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: Color.headerColor,
        },
        headerTitleStyle: {
          fontFamily: FontFamily.title,
          fontSize: getDeviceStyle(20, mobileHeadingTitleSize()),
          marginTop: getDeviceStyle(0, 2),
        },
        headerTintColor: 'white',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({navigation}) => ({
          title: `${translations['scorecardApp']}`,
          headerRight: () => (
            <SettingMenu navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="ScorecardList"
        component={ScorecardListScreen}
        options={({navigation}) => ({
          title: translations.scorecardList,
          headerRight: () => (
            <FilterButton navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="ScorecardProgress"
        component={ScorecardProgressScreen}
        options={({route, navigation}) => ({
          title: route.params.title,
          headerTitleStyle: {
            fontSize: getDeviceStyle(20, wp(lgLabelSize)),
            fontFamily: FontFamily.title,
          }
        })}
      />
      <Stack.Screen
        name="IndicatorDevelopment"
        component={IndicatorDevelopmentScreen}
        options={({navigation}) => ({
          header: () => null,
        })}
      />
      <Stack.Screen
        name="VotingCriteriaList"
        component={VotingCriteriaListScreen}
        options={({navigation}) => ({
          header: ()=> null
        })}
      />
      <Stack.Screen
        name="VotingCriteriaForm"
        component={VotingCriteriaFormScreen}
        options={{
          headerTitle: `${translations['scorecardVoting']}`,
        }}
      />
      <Stack.Screen
        name="ScorecardResult"
        component={ScorecardResultScreen}
        options={({navigation}) => ({
          header: ()=> null
        })}
      />
      <Stack.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          headerTitle: `${translations['setting']}`,
        }}
      />
      <Stack.Screen
        name="NewScorecard"
        component={NewScorecardScreen}
        options={{
          title: `${translations.startScorecard}`,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="ScorecardDetail"
        component={ScorecardDetailScreen}
        options={({navigation}) => ({
          header: () => null,
        })}
      />
      <Stack.Screen
        name="ScorecardPreference"
        component={ScorecardPreferenceScreen}
        options={({navigation}) => ({
          header: () => null,
        })}
      />
      <Stack.Screen
        name="Facilitator"
        component={FacilitatorScreen}
        options={({navigation}) => ({
          header: () => null,
        })}
      />
      <Stack.Screen
        name="ParticipantInformation"
        component={ParticipantInformationScreen}
        options={({navigation}) => ({
          header: () => null,
        })}
      />
      <Stack.Screen
        name="ParticipantList"
        component={ParticipantListScreen}
        options={({navigation}) => ({
          header: () => null,
        })}
      />
      <Stack.Screen
        name="AddNewParticipant"
        component={AddNewParticipantScreen}
        options={{
          title: `${translations.participantInformation}`,
        }}
      />
      <Stack.Screen
        name="RaisingProposed"
        component={RaisingProposedScreen}
        options={({navigation}) => ({
          header: () => null,
        })}
      />
      <Stack.Screen
        name="CreateNewIndicator"
        component={CreateNewIndicatorScreen}
        options={() => ({
          header: () => null,
        })}
      />
      <Stack.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          title: `${translations['contact']}`,
        }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: `${translations['about']}`,
        }}
      />
      <Stack.Screen
        name="OfflineParticipantList"
        component={OfflineInstructionScreen}
        options={({navigation}) => ({
          header: () => null,
        })}
      />
      <Stack.Screen
        name="OfflineRaisingProposed"
        component={OfflineInstructionScreen}
        options={({navigation}) => ({
          header: () => null,
        })}
      />
      <Stack.Screen
        name="OfflineIndicatorDevelopment"
        component={OfflineInstructionScreen}
        options={({navigation}) => ({
          header: () => null,
        })}
      />
      <Stack.Screen
        name="OfflineScorecardResult"
        component={OfflineInstructionScreen}
        options={({navigation}) => ({
          header: () => null,
        })}
      />
      <Stack.Screen
        name="SelectedImage"
        component={SelectedImageScreen}
        options={({navigator}) => ({
          header: () => null,
        })}
      />
      <Stack.Screen
        name="FilterScorecardScreen"
        component={FilterScorecardScreen}
        options={{
          title: translations.filterScorecard,
        }}
      />
    </Stack.Navigator>
  );
}

export default AppNavigator;
