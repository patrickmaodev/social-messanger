/**
 * Login Screen with modern form handling and validation
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
import { RootStackParamList } from '@/types';
import { UI_CONSTANTS, TYPOGRAPHY } from '@/config/constants';
import { VALIDATION } from '@/config/constants';
import { BaseScreen } from '@/components/common/BaseScreen';
import { ScreenContent } from '@/components/common/ScreenContent';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const errors = {
      email: '',
      password: '',
    };

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

    setFormErrors(errors);
    return !errors.email && !errors.password;
  };

  const handleInputChange = (field: string, value: string) => {
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

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
      // Navigation will be handled by the auth state change
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An error occurred during login');
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
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
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.form}>
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

          {/* Auth Error */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={navigateToRegister} disabled={isLoading}>
              <Text style={styles.registerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
        </ScreenContent>
      </KeyboardAvoidingView>
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
    ...(TYPOGRAPHY.HEADER as any),
    color: UI_CONSTANTS.COLORS.TEXT_PRIMARY,
    marginBottom: UI_CONSTANTS.SPACING.XS,
    textAlign: 'center',
  },
  subtitle: {
    ...(TYPOGRAPHY.CAPTION as any),
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
    ...(TYPOGRAPHY.CAPTION as any),
    color: UI_CONSTANTS.COLORS.TEXT_PRIMARY,
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
    ...(TYPOGRAPHY.BODY as any),
    color: UI_CONSTANTS.COLORS.TEXT_PRIMARY,
  },
  eyeIcon: {
    padding: UI_CONSTANTS.SPACING.XS,
  },
  errorContainer: {
    marginBottom: UI_CONSTANTS.SPACING.SM,
  },
  errorText: {
    ...(TYPOGRAPHY.SMALL as any),
    color: UI_CONSTANTS.COLORS.DANGER,
    marginTop: UI_CONSTANTS.SPACING.XS,
  },
  loginButton: {
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
  loginButtonDisabled: {
    backgroundColor: UI_CONSTANTS.COLORS.SURFACE,
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    ...(TYPOGRAPHY.BUTTON as any),
    color: UI_CONSTANTS.COLORS.WHITE,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    ...(TYPOGRAPHY.CAPTION as any),
    color: UI_CONSTANTS.COLORS.TEXT_SECONDARY,
  },
  registerLink: {
    ...(TYPOGRAPHY.CAPTION as any),
    color: UI_CONSTANTS.COLORS.PRIMARY,
  },
});
