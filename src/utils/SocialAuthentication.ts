import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

GoogleSignin.configure({
  webClientId:
    '633354464454-ug1nq5ndv0v8pbrsi1ejc06atrdpkl2h.apps.googleusercontent.com',
  offlineAccess: true,
  iosClientId:
    '633354464454-pmaekguh89l34j1of59g5qn6ckj66h4r.apps.googleusercontent.com',
});

export const GoogleAuth = async () => {
  try {
    // Check if device has Google Play Services
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    // Perform Google Sign-In
    const userInfo = await GoogleSignin.signIn();

    const googleCredential = auth.GoogleAuthProvider.credential(
      userInfo?.data?.idToken,
    );

    let result = await auth().signInWithCredential(googleCredential);

    const tok = await auth().currentUser.getIdToken();

    return { tok, result };
  } catch (error) {
    console.log('Message:', error.message);

    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log('User Cancelled the Login Flow');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log('Signing In');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log('Play Services Not Available or Outdated');
    } else {
      console.log('An unexpected error occurred:', error);
    }

    return null;
  }
};
