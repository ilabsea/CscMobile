import realm from '../db/schema';
import RatingScaleApi from '../api/RatingScaleApi';
import {isFileExist} from '../services/local_file_system_service';
import {getAudioFilename} from './audio_service';
import { environment } from '../config/environment';
import RNFS from 'react-native-fs';
import {getDownloadPercentage} from '../utils/scorecard_detail_util';

class RatingScaleService {
  constructor (isStopDownload) {
    this.isStopDownload = isStopDownload;
    this.ratingScaleApi = null;
  }

  async saveData(programId, updateDownloadPercentage, callback) {
    this.ratingScaleApi = new RatingScaleApi();
    const response = await this.ratingScaleApi.load(programId);
    const ratingScales = response.data;
    this._saveRatingScale(0, ratingScales, programId, updateDownloadPercentage, callback);
  }

  cancelRequest() {
    this.ratingScaleApi.cancelRequest();
  }

  _saveRatingScale(index, ratingScales, programId, updateDownloadPercentage, callback) {
    if (this.isStopDownload)
      return;

    if (index === ratingScales.length) {
      callback(true);
      return;
    }

    const ratingScale = ratingScales[index];
    const attrs = {
      id: ratingScale.id,
      name: ratingScale.name,
      value: ratingScale.value,
      program_id: programId,
    };
    realm.write(() => {
      realm.create('RatingScale', attrs, 'modified');
    });
    this._saveLanguageRatingScale(0, ratingScale, programId, () => {
      updateDownloadPercentage(getDownloadPercentage(ratingScales.length));
      this._saveRatingScale(index + 1, ratingScales, programId, updateDownloadPercentage, callback);
    });
  }

  _saveLanguageRatingScale(index, ratingScale, programId, callbackSaveRatingScale) {
    if (index === ratingScale.language_rating_scales.length) {
      callbackSaveRatingScale();
      return;
    }

    const languageRatingScale = ratingScale.language_rating_scales[index];
    const attrs = {
      id: languageRatingScale.id,
      language_code: languageRatingScale.language_code,
      audio: languageRatingScale.audio,
      content: languageRatingScale.content,
      rating_scale_id: ratingScale.id,
      rating_scale_code: ratingScale.code,
      program_id: programId,
    };

    realm.write(() => {
      realm.create('LanguageRatingScale', attrs, 'modified');
    });
    this._checkAndSave(languageRatingScale, () => {
      this._saveLanguageRatingScale(index + 1, ratingScale, programId, callbackSaveRatingScale);
    })
  }

  async _checkAndSave(languageRatingScale, callBackSaveLanguageRatingScale) {
    let audioPath = languageRatingScale.audio.split('/');
    let fileName = audioPath[audioPath.length - 1];
    fileName = `rating_${getAudioFilename(languageRatingScale.id, languageRatingScale.language_code, fileName)}`;

    const isAudioExist = await isFileExist(fileName)
    if (!isAudioExist)
      this._downloadAudio(languageRatingScale, fileName);
    else
      console.log('audio already exist');

    callBackSaveLanguageRatingScale();
  }

  _downloadAudio(languageRatingScale, filename) {
    const savingFilename = `rating_${getAudioFilename(languageRatingScale.id, languageRatingScale.language_code, filename)}`;          // Ex: rating_1_km_voice.mp3
    let options = {
      fromUrl: `${environment.domain}${languageRatingScale.audio}`,
      toFile: `${RNFS.DocumentDirectoryPath}/${savingFilename}`,
      background: false,
      progressDivider: 1,
    };
    RNFS.downloadFile(options).promise.then(res => {
      const attrs = {
        id: languageRatingScale.id,
        local_audio: options.toFile,
      };
      realm.write(() => {
        realm.create('LanguageRatingScale', attrs, 'modified');
      });
    }).catch(err => {
      console.log('failed to download audio = ', err);
    });
  }
}

export default RatingScaleService;