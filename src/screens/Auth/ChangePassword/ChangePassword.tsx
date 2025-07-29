import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Keyboard } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import authApiInstance from '../../../services/auth/auth';
import Input from '../../../components/Form/Input/Input';
import { setApiErrorsToForm } from '../../../library/utilities/message';
import { useCapitalizedTranslation } from '../../../hooks/useCapitalizedTranslation';
import AppButton from '../../../components/Button';
import { IChangePasswordForm, IChangePasswordProps } from './ChangePassword.model';
import { showToast } from '../../../library/utilities/helperFunction';

export default function ChangePassword(props: Readonly<IChangePasswordProps>) {
  const { navigation } = props;
  const { t } = useCapitalizedTranslation();
  const methods = useForm({
    defaultValues: {
      currentPassword: '',
      password: '',
      confirmPassword: '',
    },
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;
  const [isLogin, setIsLogin] = useState(false);

  const onHandleChangePassword = async (data: IChangePasswordForm) => {
    try {
      setIsLogin(true);
      const res = await authApiInstance.changeMyPassword(data);
      if (res.response.success) {
        showToast('success', 'Password changed successfully.');
        navigation.goBack();
        methods.reset();
        Keyboard.dismiss();
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
    <SafeAreaView style={styles.container}>
      <View style={styles.infoContainer}>
        <Controller
          control={control}
          name="currentPassword"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder={t('auth.changePassword.currentPassword')}
              value={value}
              onChange={onChange}
              attribute="currentPassword"
              errorMessage={errors.currentPassword?.message}
              textContentType="password"
              secureTextEntry
            />
          )}
        />
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
          text={t('components.button.name.update')}
          onPress={handleSubmit(onHandleChangePassword)}
          style={styles.button}
          loading={isLogin}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    flex: 1,
  },
  infoContainer: {
    marginTop: 40,
    width: '90%',
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  button: {
    marginTop: 20,
  },
});
