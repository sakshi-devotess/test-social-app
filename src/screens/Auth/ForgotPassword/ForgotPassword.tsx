import React, { useState } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import backImage from '../../../assets/signupBg.jpg';
import authApiInstance from '../../../services/auth/auth';
import { colors } from '../../../config/constants';
import Input from '../../../components/Form/Input/Input';
import { setApiErrorsToForm } from '../../../library/utilities/message';
import { useCapitalizedTranslation } from '../../../hooks/useCapitalizedTranslation';
import AppButton from '../../../components/Button';
import { IForgotPasswordProps } from './ForgotPassword.model';
import { showToast } from '../../../library/utilities/helperFunction';
const { height } = Dimensions.get('window');

export default function ForgotPassword(props: Readonly<IForgotPasswordProps>) {
  const { navigation } = props;
  const { t } = useCapitalizedTranslation();
  const methods = useForm({
    defaultValues: {
      username: '',
    },
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;
  const [isLogin, setIsLogin] = useState(false);

  const onHandleResetPassword = async (data: { username: string }) => {
    try {
      setIsLogin(true);
      const res = await authApiInstance.forgotPassword(data.username);
      if (res.response.success) {
        showToast('info', 'Password reset link sent to your email.');
        navigation.navigate('Login');
      } else {
        setApiErrorsToForm(res, methods);
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
              <SafeAreaView>
                <Text style={styles.title}>{t('auth.login.forgotPassword')}</Text>
                <Text style={styles.subTitle}>{t('auth.resetPassword.resetPasswordText')}</Text>

                <Controller
                  control={control}
                  name="username"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder={t('auth.login.userName')}
                      value={value}
                      onChange={onChange}
                      errorMessage={errors.username?.message}
                    />
                  )}
                />

                <AppButton
                  text={t('components.button.name.send')}
                  onPress={handleSubmit(onHandleResetPassword)}
                  disabled={isLogin}
                />

                <View style={styles.footerRow}>
                  <Text style={styles.footerText}>{t('auth.login.backToLogin')}? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.footerLink}> {t('components.button.name.login')}</Text>
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
    borderTopLeftRadius: 60,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  title: {
    alignSelf: 'center',
    fontSize: height * 0.03,
    fontWeight: 'bold',
    color: 'black',
    paddingBottom: 10,
  },
  subTitle: {
    alignSelf: 'center',
    fontSize: 14,
    color: 'black',
    paddingBottom: 20,
  },
  button: {
    height: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 18,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: height * 0.05,
  },
  footerText: {
    color: 'gray',
    fontSize: 14,
    fontWeight: '600',
  },
  footerLink: {
    color: colors.pink,
    fontWeight: '600',
    fontSize: 14,
  },
});
