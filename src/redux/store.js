import { Iterable } from 'immutable'

import { 
    configureStore,
    createSerializableStateInvariantMiddleware,
    isPlain
 } from '@reduxjs/toolkit'

import editorReducer from '../pages/note/editorSlice'
import recordingReducer from '../components/noteComponent/recording/recordingSlice'
import presentNoteReducer from '../components/homepageComponent/displayContent/presentNoteSlice'
import noteListReducer from '../components/homepageComponent/displayContent/noteListSlice'
import globalMaskReducer from '../components/homepageComponent/globalMask/globalMaskSlice'
import tagListReducer from '../components/homepageComponent/displayContent/tagListSlice'
import chooseItemSlice from '../components/homepageComponent/sidebar/chooseItemSlice'
import diffFlagSlice from '../components/homepageComponent/displayContent/diffFlag'
const isSerializable = (value) => Iterable.isIterable(value) || isPlain(value)

const getEntries = (value) =>
  Iterable.isIterable(value) ? value.entries() : Object.entries(value)

const serializableMiddleware = createSerializableStateInvariantMiddleware({
  isSerializable,
  getEntries,
})

const store = configureStore({
    reducer:{
      editor:editorReducer,
      record:recordingReducer,
      presentNote:presentNoteReducer,
      noteList:noteListReducer,
      globalMask:globalMaskReducer,
      tagList:tagListReducer,
      chooseItem:chooseItemSlice,
      diffFlag:diffFlagSlice
    },
    middleware: [serializableMiddleware],
})

export default store