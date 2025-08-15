import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  AccessibilityInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../../services/api';
import { Colors, STORAGE_KEYS, VALIDATION, ERROR_MESSAGES, A11Y_LABELS } from '../../constants';

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  
  const passwordInputRef = useRef<TextInput>(null);

  React.useEffect(() => {
    checkAccessibilitySettings();
  }, []);

  const checkAccessibilitySettings = async () => {
    const isHighContrast = await AsyncStorage.getItem(STORAGE_KEYS.HIGH_CONTRAST_MODE);
    setHighContrast(isHighContrast === 'true');
  };

  const validateForm = (): boolean => {
    if (!VALIDATION.EMAIL_REGEX.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return false;
    }
    if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
      Alert.alert('Invalid Password', `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters.`);
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;
      
      // Store auth data
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      await AsyncStorage.setItem(STORAGE_KEYS.USER_ROLE, user.role);
      
      // Navigate to appropriate screen based on role
      if (user.role === 'helper' && !user.isVerified) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'HelperVerification' }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainApp' }],
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || ERROR_MESSAGES.NETWORK_ERROR;
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const styles = highContrast ? highContrastStyles : defaultStyles;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title} accessibilityRole="header">
              Welcome Back
            </Text>
            <Text style={styles.subtitle}>
              Sign in to continue helping or requesting tasks
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={styles.placeholderColor}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
                accessible
                accessibilityLabel="Email input field"
                accessibilityHint="Enter your email address to login"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  ref={passwordInputRef}
                  style={[styles.input, styles.passwordInput]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={styles.placeholderColor}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                  textContentType="password"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  accessible
                  accessibilityLabel="Password input field"
                  accessibilityHint="Enter your password to login"
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                  accessible
                  accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                  accessibilityRole="button"
                >
                  <Text style={styles.passwordToggleText}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => navigation.navigate('ForgotPassword')}
              accessible
              accessibilityRole="link"
              accessibilityLabel="Forgot password"
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Login button"
              accessibilityState={{ disabled: loading }}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.signupLink}
              onPress={() => navigation.navigate('Signup')}
              accessible
              accessibilityRole="link"
              accessibilityLabel="Sign up for new account"
            >
              <Text style={styles.signupText}>
                Don't have an account? <Text style={styles.signupTextBold}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.accessibilityToggle}
            onPress={async () => {
              const newValue = !highContrast;
              setHighContrast(newValue);
              await AsyncStorage.setItem(STORAGE_KEYS.HIGH_CONTRAST_MODE, String(newValue));
              AccessibilityInfo.announceForAccessibility(
                `High contrast mode ${newValue ? 'enabled' : 'disabled'}`
              );
            }}
            accessible
            accessibilityRole="switch"
            accessibilityLabel="Toggle high contrast mode"
            accessibilityState={{ checked: highContrast }}
          >
            <Text style={styles.accessibilityToggleText}>
              High Contrast Mode: {highContrast ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.dark,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    paddingRight: 60,
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
  passwordToggleText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  placeholderColor: Colors.gray,
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.lightGray,
  },
  dividerText: {
    marginHorizontal: 16,
    color: Colors.gray,
    fontSize: 14,
  },
  signupLink: {
    alignItems: 'center',
    marginBottom: 20,
  },
  signupText: {
    fontSize: 16,
    color: Colors.gray,
  },
  signupTextBold: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  accessibilityToggle: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 20,
  },
  accessibilityToggleText: {
    fontSize: 14,
    color: Colors.gray,
  },
});

const highContrastStyles = StyleSheet.create({
  ...defaultStyles,
  container: {
    ...defaultStyles.container,
    backgroundColor: Colors.white,
  },
  title: {
    ...defaultStyles.title,
    color: Colors.black,
  },
  subtitle: {
    ...defaultStyles.subtitle,
    color: Colors.black,
  },
  label: {
    ...defaultStyles.label,
    color: Colors.black,
  },
  input: {
    ...defaultStyles.input,
    backgroundColor: Colors.white,
    borderColor: Colors.black,
    borderWidth: 2,
    color: Colors.black,
  },
  placeholderColor: Colors.gray,
  loginButton: {
    ...defaultStyles.loginButton,
    backgroundColor: Colors.highContrast.primary,
  },
  forgotPasswordText: {
    ...defaultStyles.forgotPasswordText,
    color: Colors.highContrast.primary,
    textDecorationLine: 'underline',
  },
  passwordToggleText: {
    ...defaultStyles.passwordToggleText,
    color: Colors.highContrast.primary,
    textDecorationLine: 'underline',
  },
  signupTextBold: {
    ...defaultStyles.signupTextBold,
    color: Colors.highContrast.primary,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;