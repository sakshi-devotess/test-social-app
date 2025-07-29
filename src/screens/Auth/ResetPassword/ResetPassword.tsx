import React, { useContext, useState } from 'react';
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
import { IResetPasswordForm, IResetPasswordProps } from './ResetPassword.model';
import { showToast } from '../../../library/utilities/helperFunction';
import { useRoute } from '@react-navigation/native';
import { MessageContext } from '../../../contexts/MessageContext';
const { height } = Dimensions.get('window');

export default function ResetPassword(props: Readonly<IResetPasswordProps>) {
  const { navigation } = props;
  const route = useRoute();
  const { pushMessageFromMutationResponse } = useContext(MessageContext);
  const { token } = route.params as { token: string };
  const { t } = useCapitalizedTranslation();
  const methods = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
      token: token || '',
    },
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;
  const [isLogin, setIsLogin] = useState(false);

  const onHandleResetPassword = async (data: IResetPasswordForm) => {
    try {
      setIsLogin(true);
      const res = await authApiInstance.resetPassword(data);
      pushMessageFromMutationResponse(res.response);
      if (res.response.success) {
        showToast('info', 'Password reset successfully.');
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
                <Text style={styles.title}>{t('auth.resetPassword.name')}</Text>

                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder={t('auth.changePassword.password')}
                      value={value}
                      onChange={onChange}
                      attribute="password"
                      errorMessage={errors.password?.message}
                      textContentType="password"
                      secureTextEntry
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder={t('auth.changePassword.confirmNewPassword')}
                      value={value}
                      onChange={onChange}
                      attribute="confirmPassword"
                      errorMessage={errors.confirmPassword?.message}
                      textContentType="password"
                      secureTextEntry
                    />
                  )}
                />

                <AppButton
                  text={t('components.button.name.save')}
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
    paddingBottom: 20,
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
