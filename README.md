# Proximity Marketing Application
Closetify Proximity Marketing Solution is a project designed to employ BLE beacons to market offers to the users based on their proximity to a promotional item. The solution consists of:
1. Management Dashboard: 
The dashboard helps the store management setup and manage the location of beacons and promotional items in the store. The management dashboard is created as a React Web App.
2. Mobile Application:
The mobile application is used by the end user/customer to be notified of nearby promotional items. The mobile application is created using React Native to support iOS and Android devices.
3. BLE Beacons:
Bluetooth low energy beacons are used to calculate the user's location co-ordinates in the store using trilateration algorithm.

## Management Dashboard Guide
### Setup and Initialization

Start by cloning the Github repo.
React relies on Node.js and npm for managing dependencies and running build scripts. Make
sure you have both installed on your system.
To initialize the web application(Management Dashboard):
1. cd into 'management_dashboard' folder
2. Run 'npm install' from the terminal window
3. Run 'npm start'
4. The web application should be running at http://localhost:3000/login
Running Tests
1. Cd into management dashboard folder
2. Run npx cypress run
3. Select E2E tests and then select chrome
4. Navigate to spec and click play

### Core Functionality
**Account Creation and Login:** 

Once setup is complete navigate to localhost:3000, here you should see a login page. If you are
a returning user login with your credentials. If this is your first time using Closetify, click register
and create a new account.

**Map Page**

* The map page serves as the entry point for all functionalities related to the store map and the
beacons.

* Click add beacon to pop open the beacon modal, enter beacon fields and click save.

![image](https://github.com/user-attachments/assets/5ebd0253-e504-46a6-9129-fbc9fa9cc5cb)

* Double click the beacon you would like to edit or delete. This will open the beacon modal,
options to edit and delete are found inside. If you would like to quickly change a beacon location
you can drag and drop the beacon to the new location.

* To change store dimensions enter the new dimensions you would like and click save.

**Coupon Page**

* Click add coupon to pop open the coupon modal, enter coupon on fields and click save.

* Double click the coupon you would like to edit or delete. This will open the coupon modal,
options to edit and delete are found inside.

![image](https://github.com/user-attachments/assets/c30a5e41-4a44-4793-9d5f-9f432092a901)

**Reports Page**

Reports for the month are shown by default. The report date range can be adjusted using the
date fields at the top of the page. Hover over the line and bar chart to reveal a tooltip with more
information. 


## Mobile Application Guide
### Setup and Initialization
Before running the mobile application, you would need to set up the environment to support
mobile application development. Please see details to setup the development environment here:
1. For a Windows Operating system and Android mobile application, please follow
instructions here: https://reactnative.dev/docs/environmentsetup?guide=native&os=windows&platform=android
2. For a Mac operating system and iOS mobile application, please follow instructions here:
https://reactnative.dev/docs/environment-setup?guide=native&os=macos&platform=ios
You would also need to install an iOS or Android Emulator. Please see documentation below for
setting up an emulator:
1. For android: https://reactnative.dev/docs/environment-setup?platform=android
2. For iOS: https://reactnative.dev/docs/environment-setup?platform=ios&os=macos
To run the mobile application for iOS platform(User facing app):
1.Once you have installed an emulator, start it
2. cd into 'mobileapp' folder
3. Run 'npm install' from the terminal window
4. cd into 'ios' folder. Then run 'pod install'.
5. 'cd ..' into 'mobileapp'
6. Run 'npm start'
7. Once the service is running, press 'i' in the terminal to launch the app on an iOS emulator.
8. The app should successfully launch on the specified emulator.
To run the mobile application for Android platform(User facing app):
1.Once you have installed an emulator, start it
2. cd into 'mobileapp' folder
3. Run 'npm install' from the terminal window
6. Run 'npm start'
7. Once the service is running, press ‘a' in the terminal to launch the app on an android
emulator.
8. The app should successfully launch on the specified emulator.

### Running Tests
Requirement: The mobile application testing framework uses Detox which is available only on
mac or linux devices. Please ensure to follow the below guidelines on a mac or linux based
operating system.

1. Clone the project from Github
2. cd into mobileapp folder via terminal
3. Run npm install command
4. cd into ios folder and run pod install
5. cd .. back into mobileapp folder
6. Run npm install detox-cli --global
The above command installs detox command line tools
7. Run the following commands to install applesimutils
brew tap wix/brew
brew install applesimutils
8. Another requirement is to have the required emulators installed. In our case, the 2
emulators are iPhone 15 and Pixel_API_28_AOSP
To install the iPhone 15 emulator, please follow these steps:
https://developer.apple.com/documentation/safari-developer-tools/adding-additionalsimulators#Adding-a-Simulator
To install the Pixel_API_28_AOSP simulator, follow these steps:
https://wix.github.io/Detox/docs/guide/android-dev-env#android-aosp-emulators
9. For iOS:
Run detox build --configuration ios.sim.release
The above command builds the app.
Run detox test --configuration ios.sim.release
The above command runs the test suite.
10. For Android:
Run detox build --configuration android.emu.release
The above command builds the app.
Run detox test --configuration android.emu.release
The above command runs the test suite.

### Core Functionality

**Account Creation and Login**

![image](https://github.com/user-attachments/assets/d8f92e60-8c8a-4443-898f-64583a75ae02)

Once the setup is complete and the application is running on a simulator, you should see a
login page. If you are a returning user, login with your credentials. If this is your first time using
Closetify, click the ‘Sign-up here’ button and create a new account.
Coupons Page

![image](https://github.com/user-attachments/assets/69191dde-fc3a-4c9b-85b2-7169d69eb902)

* Upon logging in, the user is navigated to the ‘Coupons’ page which displays a list of call
coupons available to the user.
* The Coupons page serves as the entry point for all functionalities related to the mobile
application. The user can navigate to the Saved Coupons, Profile, or Nearby Coupon screen
from here.
* To save a coupon, the user can press the ‘Save’ button on the coupon they wish to save. Saved
coupons can be accessed from the ‘Saved’ screen.
* To redeem a coupon, the user can press the Redeem button on the coupon they wish to
redeem. They will be presented with a popup window which provides the promocode for the
coupon.
* Saved Coupons Page

![image](https://github.com/user-attachments/assets/a7550bff-45cb-41e2-b557-48b634d001dd)

* The Profile page has the option to logout and to start the simulation of user movement through
the store. If a coupon has been added along the user’s simulated path, a notification pops up to
notify the user of the presence of a coupon. The user can click on the notification and they will
be navigated to the ‘Nearby’ screen where the active coupon is displayed.
