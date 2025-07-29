import React, { useCallback, useContext, useState } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { colors, clientTypes } from '../../../config/constants';
import backImage from '../../../assets/signupBg.jpg';
import authApiInstance from '../../../services/auth/auth';
import { AuthenticatedUserContext } from '../../../contexts/AuthenticatedUserContext';
import Input from '../../../components/Form/Input/Input';
import AppButton from '../../../components/Button';
import { setApiErrorsToForm } from '../../../library/utilities/message';
import { ISignInForm, ISignInProps } from './Login.model';
import { useCapitalizedTranslation } from '../../../hooks/useCapitalizedTranslation';

const { height } = Dimensions.get('window');

export default function Login(props: Readonly<ISignInProps>) {
  const { navigation } = props;
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const { t } = useCapitalizedTranslation();
  const methods = useForm();
  const { setUser, SetLoginState } = useContext(AuthenticatedUserContext);
  const [isLogin, setIsLogin] = useState(false);
  useFocusEffect(
    useCallback(() => {
      reset({
        username: '',
        password: '',
      });
    }, [])
  );
  const onSubmit = async (data: ISignInForm) => {
    try {
      setIsLogin(true);
      const res = await authApiInstance.signIn({
        username: data.username,
        password: data.password,
        clientType: clientTypes.MOBILE,
      });
      if (res.response.success) {
        const userData = {
          access_token: res.access_token,
          refresh_token: res.refresh_token,
          companyHasUserId: res.companyHasUserId,
        };
        await SecureStore.setItemAsync('userData', JSON.stringify(userData));
        await setUser(userData);
        await SetLoginState(true);
      }
    } catch (err: any) {
      setApiErrorsToForm(err?.response, methods);
    } finally {
      setIsLogin(false);
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.imageWrapper}>
            <Image source={backImage} style={styles.backImage} />
          </View>

          <View style={styles.whiteSheet}>
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <SafeAreaView style={styles.form}>
                <Text style={styles.title}>{t('auth.login.name')}</Text>

                <Controller
                  control={control}
                  rules={{
                    required: 'Username is required',
                  }}
                  name="username"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder={t('objects.user.attributes.username')}
                      value={value}
                      onChange={onChange}
                      errorMessage={errors.username?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  rules={{
                    required: 'Password is required',
                  }}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder={t('objects.user.attributes.password')}
                      value={value}
                      onChange={onChange}
                      errorMessage={errors.password?.message}
                      textContentType="password"
                      secureTextEntry
                    />
                  )}
                />
                <View style={styles.forgotPasswordSection}>
                  <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={styles.signUpText}>{t('auth.login.forgotPassword')}</Text>
                  </TouchableOpacity>
                </View>
                <AppButton
                  text={t('components.button.name.login')}
                  onPress={handleSubmit(onSubmit)}
                  style={styles.button}
                  disabled={isLogin}
                />
                <View style={styles.noAccountSection}>
                  <Text style={styles.noAccountText}>{t('auth.signup.notHaveAccountText')} </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.signUpText}>{t('components.button.name.signup')}</Text>
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  title: {
    alignSelf: 'center',
    fontSize: height * 0.04,
    fontWeight: 'bold',
    color: 'black',
    paddingBottom: 20,
    marginTop: 10,
  },
  button: {
    height: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 10,
  },
  noAccountSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  forgotPasswordSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  noAccountText: {
    color: 'gray',
    fontSize: 14,
    fontWeight: '600',
  },
  signUpText: {
    color: colors.pink,
    fontWeight: '600',
    fontSize: 14,
  },
  imageWrapper: {
    height: height * 0.25,
    width: '100%',
  },
  backImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  whiteSheet: {
    position: 'absolute',
    top: height * 0.25,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  form: {
    flex: 1,
  },
});
