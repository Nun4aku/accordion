import { transform } from '@babel/core';
import React, {useRef, useState} from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Animated, Platform, UIManager} from 'react-native';
import ChevronUpOutlineIcon from '../../components/Icons/ChevronUpOutlineIcon';
import { LayoutAnimation } from 'react-native';
import {
  themeOptions,
  ThemeStore,
  default as ThemeStoreDefault
} from 'framework/store/ThemeStore';

//для того, что бы LayoutAnimation работал на андройде нужна эта проверка
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}


const Accordion = ( {
  backgroundColor = ThemeStoreDefault.colorSet.COLOR_WHITE,
  style = {},
  title,
  titleMarginRight = 5,
  titleMarginLeft = 10,
  icon = <ChevronUpOutlineIcon size={40} color={ThemeStoreDefault.colorSet.COLOR_GREEN}/>,
  iconMarginRight = 10,
  iconMarginLeft = 0,
  body,
  bodyMarginHorizontal = 0,
  bodyMarginVertical = 0,
  disabled = false
} ) => {
  const [showContent, setShowContent] = useState(false);
  const animationController = useRef( new Animated.Value(0)).current


  const toggleAnimation = {
    duration: 300,
    update: {
      duration: 300,
      property: LayoutAnimation.Properties.opacity,
      type: LayoutAnimation.Types.easeInEaseOut
    },
    delete: {
      duration: 300,
      property: LayoutAnimation.Properties.opacity,
      type: LayoutAnimation.Types.easeInEaseOut
    }
  }

  const toggleListItem = ( ) => {

    if(disabled) return;

    const config = {
      duration: 300,
      toValue: showContent ? 0 : 1,
      useNativeDriver: true
    };
    Animated.timing(animationController, config).start();
    LayoutAnimation.configureNext(toggleAnimation);
    setShowContent(!showContent);
  }

  const arrowTransform = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '0deg']
  })


  return (
    <View style={{...style, backgroundColor: backgroundColor, overflow: 'hidden',}}>
      <TouchableOpacity onPress={ ()=>{toggleListItem()} }>
          <View style={[styles.titleContainer, {backgroundColor: backgroundColor}]}>
            {
              typeof(title) === 'string' ? (
                <Text style={{marginLeft: titleMarginLeft, marginRight:titleMarginRight, color: ThemeStoreDefault.colorSet.COLOR_BLACK}}>{title}</Text>
              ) : (
                <View style={{marginLeft: titleMarginLeft, marginRight:titleMarginRight}}>{title}</View>
              )
            }
            <Animated.View style={{marginRight: iconMarginRight, marginLeft: iconMarginLeft, transform: [{rotateZ: arrowTransform}]}}>
              {icon}
            </Animated.View>
          </View>
      </TouchableOpacity>

      {
        showContent && (
          <View style={{backgroundColor: backgroundColor, padding: 5}}>
            {
              typeof(body) === 'string' ? (
                <Text style={{marginHorizontal: bodyMarginHorizontal, marginVertical: bodyMarginVertical, color: ThemeStoreDefault.colorSet.COLOR_BLACK}}>{body}</Text>
              ) : (
                <View style={{marginHorizontal: bodyMarginHorizontal, marginVertical: bodyMarginVertical}}>{body}</View>
              )
            }
            
          </View>
        )
      }
      

    </View>
  )
}

export default Accordion;

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
  }
})