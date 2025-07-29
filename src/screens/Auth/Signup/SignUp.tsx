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
import { useQuery } from '@apollo/client';
import backImage from '../../../assets/signupBg.jpg';
import authApiInstance from '../../../services/auth/auth';
import { GET_All_ADMIN_COMPANIES_LIGHT } from '../../../graphql/queries/Company/company.query';
import Input from '../../../components/Form/Input/Input';
import FormPicker from '../../../components/Form/Picker/Picker';
import { colors } from '../../../config/constants';
import { ISignUpForm, ISignUpProps } from './Signup.model';
import { setApiErrorsToForm } from '../../../library/utilities/message';
import { useCapitalizedTranslation } from '../../../hooks/useCapitalizedTranslation';
import { showToast } from '../../../library/utilities/helperFunction';
import AppButton from '../../../components/Button';
const { height } = Dimensions.get('window');
export default function SignUp(props: Readonly<ISignUpProps>) {
  const { navigation } = props;
  const { t } = useCapitalizedTranslation();
  const methods = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      company_id: null,
      password: '',
      confirmPassword: '',
    },
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;
  const { data } = useQuery(GET_All_ADMIN_COMPANIES_LIGHT);
  const [isLogin, setIsLogin] = useState(false);

  const onHandleSignup = async (data: ISignUpForm) => {
    try {
      setIsLogin(true);
      const res = await authApiInstance.signUp({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        company_id: data.company_id!,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      if (res.response.success) {
        showToast('info', 'Account created successfully. Please Check mail.');
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
                <Text style={styles.title}>{t('auth.signup.name')}</Text>

                <Controller
                  control={control}
                  name="first_name"
                  rules={{ required: 'First name is required' }}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder={t('objects.user.attributes.firstName')}
                      value={value}
                      onChange={onChange}
                      errorMessage={errors.first_name?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="last_name"
                  rules={{ required: 'Last name is required' }}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder={t('objects.user.attributes.lastName')}
                      value={value}
                      onChange={onChange}
                      errorMessage={errors.last_name?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="email"
                  rules={{ required: 'Email is required' }}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder={t('objects.companyHasUser.attributes.email')}
                      value={value}
                      onChange={onChange}
                      keyboardType="email-address"
                      errorMessage={errors.email?.message}
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

                <Controller
                  control={control}
                  rules={{
                    required: 'Confirm password is required',
                  }}
                  name="confirmPassword"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder={t('objects.user.attributes.confirmPassword')}
                      value={value}
                      onChange={onChange}
                      errorMessage={errors.confirmPassword?.message}
                      textContentType="password"
                      secureTextEntry
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="company_id"
                  rules={{ required: 'Please select a site' }}
                  render={({ field: { onChange, value } }) => (
                    <FormPicker
                      value={value}
                      onChange={onChange}
                      placeholder={t('objects.company.headingLabels.singular')}
                      items={
                        data?.getAllAdminCompany?.map((company) => ({
                          label: company.name,
                          value: company.id,
                        })) || []
                      }
                      errorMessage={errors.company_id?.message}
                    />
                  )}
                />
                <AppButton
                  text={t('components.button.name.signup')}
                  onPress={handleSubmit(onHandleSignup)}
                  style={styles.button}
                  disabled={isLogin}
                />

                <View style={styles.footerRow}>
                  <Text style={styles.footerText}>{t('auth.signup.alreadyHaveAccountText')}</Text>
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
    fontSize: height * 0.04,
    fontWeight: 'bold',
    color: 'black',
    paddingBottom: 10,
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
