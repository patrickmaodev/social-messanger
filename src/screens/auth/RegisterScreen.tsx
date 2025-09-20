/**
 * Register Screen with modern form handling and validation
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, UserRegistrationData } from '@/types';
import { UI_CONSTANTS } from '@/config/constants';
import { VALIDATION } from '@/config/constants';
import { BaseScreen } from '@/components/common/BaseScreen';
import { ScreenContent } from '@/components/common/ScreenContent';
import { SocialModal } from '@/components/ui/SocialModal';
import { useSocialModal } from '@/hooks/useSocialModal';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register, isLoading, error, clearError } = useAuth();
  const { modalConfig, isVisible, showModal, hideModal, handleConfirm } = useSocialModal();
  
  const [formData, setFormData] = useState<UserRegistrationData>({
    full_name: '',
    email: '',
    password: '',
    password_confirm: '',
    profile_picture: '',
  });
  
  const [formErrors, setFormErrors] = useState({
    full_name: '',
    email: '',
    password: '',
    password_confirm: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = (): boolean => {
    const errors = {
      full_name: '',
      email: '',
      password: '',
      password_confirm: '',
    };

    // Full name validation
    if (!formData.full_name) {
      errors.full_name = 'Full name is required';
    } else if (formData.full_name.length < VALIDATION.NAME.MIN_LENGTH) {
      errors.full_name = `Name must be at least ${VALIDATION.NAME.MIN_LENGTH} characters`;
    } else if (formData.full_name.length > VALIDATION.NAME.MAX_LENGTH) {
      errors.full_name = `Name must be less than ${VALIDATION.NAME.MAX_LENGTH} characters`;
    }

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!VALIDATION.EMAIL.REGEX.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < VALIDATION.PASSWORD.MIN_LENGTH) {
      errors.password = `Password must be at least ${VALIDATION.PASSWORD.MIN_LENGTH} characters`;
    }

    // Password confirmation validation
    if (!formData.password_confirm) {
      errors.password_confirm = 'Please confirm your password';
    } else if (formData.password !== formData.password_confirm) {
      errors.password_confirm = 'Passwords do not match';
    }

    setFormErrors(errors);
    return !Object.values(errors).some(error => error !== '');
  };

  const handleInputChange = (field: keyof UserRegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear auth error when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await register(formData, false); // Don't auto-login
      showModal({
        title: 'Registration Successful!',
        message: 'Your account has been created successfully. You can now sign in with your credentials.',
        type: 'success',
        showCancel: false,
        confirmText: 'Continue to Login',
        onConfirm: () => navigation.navigate('Login'),
        icon: 'checkmark-circle',
      });
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'An error occurred during registration');
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <BaseScreen>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScreenContent
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join our community today</Text>
        </View>

        <View style={styles.form}>
          {/* Full Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <View style={[styles.inputWrapper, formErrors.full_name && styles.inputError]}>
              <Ionicons
                name="person-outline"
                size={20}
                color={formErrors.full_name ? UI_CONSTANTS.COLORS.DANGER : UI_CONSTANTS.COLORS.PRIMARY}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor={UI_CONSTANTS.COLORS.TEXT_SECONDARY}
                value={formData.full_name}
                onChangeText={(value) => handleInputChange('full_name', value)}
                autoCapitalize="words"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>
            {formErrors.full_name ? <Text style={styles.errorText}>{formErrors.full_name}</Text> : null}
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[styles.inputWrapper, formErrors.email && styles.inputError]}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={formErrors.email ? UI_CONSTANTS.COLORS.DANGER : UI_CONSTANTS.COLORS.PRIMARY}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={UI_CONSTANTS.COLORS.TEXT_SECONDARY}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>
            {formErrors.email ? <Text style={styles.errorText}>{formErrors.email}</Text> : null}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputWrapper, formErrors.password && styles.inputError]}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={formErrors.password ? UI_CONSTANTS.COLORS.DANGER : UI_CONSTANTS.COLORS.PRIMARY}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={UI_CONSTANTS.COLORS.TEXT_SECONDARY}
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
                disabled={isLoading}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={UI_CONSTANTS.COLORS.DARK}
                />
              </TouchableOpacity>
            </View>
            {formErrors.password ? <Text style={styles.errorText}>{formErrors.password}</Text> : null}
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={[styles.inputWrapper, formErrors.password_confirm && styles.inputError]}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={formErrors.password_confirm ? UI_CONSTANTS.COLORS.DANGER : UI_CONSTANTS.COLORS.PRIMARY}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor={UI_CONSTANTS.COLORS.TEXT_SECONDARY}
                value={formData.password_confirm}
                onChangeText={(value) => handleInputChange('password_confirm', value)}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
                disabled={isLoading}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={UI_CONSTANTS.COLORS.DARK}
                />
              </TouchableOpacity>
            </View>
            {formErrors.password_confirm ? <Text style={styles.errorText}>{formErrors.password_confirm}</Text> : null}
          </View>

          {/* Auth Error */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={navigateToLogin} disabled={isLoading}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
        </ScreenContent>
      </KeyboardAvoidingView>
      
      {/* Success Modal */}
      {modalConfig && (
        <SocialModal
          visible={isVisible}
          title={modalConfig.title}
          message={modalConfig.message}
          type={modalConfig.type}
          showCancel={modalConfig.showCancel}
          confirmText={modalConfig.confirmText}
          onConfirm={handleConfirm}
          onClose={hideModal}
          icon={modalConfig.icon}
        />
      )}
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: UI_CONSTANTS.SPACING.LG,
  },
  header: {
    alignItems: 'center',
    marginBottom: UI_CONSTANTS.SPACING.LG,
  },
  title: {
    fontSize: UI_CONSTANTS.FONT_SIZES.XL,
    fontWeight: '600',
    color: UI_CONSTANTS.COLORS.DARK,
    marginBottom: UI_CONSTANTS.SPACING.XS,
  },
  subtitle: {
    fontSize: UI_CONSTANTS.FONT_SIZES.SM,
    color: UI_CONSTANTS.COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: UI_CONSTANTS.SPACING.MD,
  },
  label: {
    fontSize: UI_CONSTANTS.FONT_SIZES.SM,
    fontWeight: '500',
    color: UI_CONSTANTS.COLORS.DARK,
    marginBottom: UI_CONSTANTS.SPACING.XS,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: UI_CONSTANTS.COLORS.BORDER,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.MD,
    backgroundColor: UI_CONSTANTS.COLORS.WHITE,
    paddingHorizontal: UI_CONSTANTS.SPACING.SM,
    paddingVertical: UI_CONSTANTS.SPACING.SM,
    shadowColor: UI_CONSTANTS.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputError: {
    borderColor: UI_CONSTANTS.COLORS.DANGER,
  },
  inputIcon: {
    marginRight: UI_CONSTANTS.SPACING.SM,
  },
  input: {
    flex: 1,
    fontSize: UI_CONSTANTS.FONT_SIZES.SM,
    color: UI_CONSTANTS.COLORS.DARK,
  },
  eyeIcon: {
    padding: UI_CONSTANTS.SPACING.XS,
  },
  errorContainer: {
    marginBottom: UI_CONSTANTS.SPACING.SM,
  },
  errorText: {
    fontSize: UI_CONSTANTS.FONT_SIZES.XS,
    color: UI_CONSTANTS.COLORS.DANGER,
    marginTop: UI_CONSTANTS.SPACING.XS,
  },
  registerButton: {
    backgroundColor: UI_CONSTANTS.COLORS.PRIMARY,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.LG,
    paddingVertical: UI_CONSTANTS.SPACING.MD,
    alignItems: 'center',
    marginBottom: UI_CONSTANTS.SPACING.MD,
    shadowColor: UI_CONSTANTS.COLORS.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  registerButtonDisabled: {
    backgroundColor: UI_CONSTANTS.COLORS.SURFACE,
    shadowOpacity: 0,
    elevation: 0,
  },
  registerButtonText: {
    fontSize: UI_CONSTANTS.FONT_SIZES.MD,
    fontWeight: '500',
    color: UI_CONSTANTS.COLORS.WHITE,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: UI_CONSTANTS.FONT_SIZES.SM,
    color: UI_CONSTANTS.COLORS.TEXT_SECONDARY,
  },
  loginLink: {
    fontSize: UI_CONSTANTS.FONT_SIZES.SM,
    fontWeight: '500',
    color: UI_CONSTANTS.COLORS.PRIMARY,
  },
});
