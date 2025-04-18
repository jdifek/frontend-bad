interface PopupButton {
  id?: string;
  type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
  text?: string;
}

interface PopupParams {
  title?: string;
  message: string;
  buttons?: PopupButton[];
}

interface ScanQrPopupParams {
  text?: string;
}

interface StoryWidgetLink {
  url: string;
  name?: string;
}

interface StoryShareParams {
  text?: string;
  widget_link?: StoryWidgetLink;
}

interface EmojiStatusParams {
  duration?: number;
}

interface DownloadFileParams {
  url: string;
  file_name: string;
}

interface SafeAreaInset {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface ContentSafeAreaInset {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface WebAppUser {
  id: number;
  is_bot?: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  added_to_attachment_menu?: boolean;
  allows_write_to_pm?: boolean;
  photo_url?: string;
}

interface WebAppChat {
  id: number;
  type: 'group' | 'supergroup' | 'channel';
  title: string;
  username?: string;
  photo_url?: string;
}

interface WebAppInitData {
  query_id?: string;
  user?: WebAppUser;
  receiver?: WebAppUser;
  chat?: WebAppChat;
  chat_type?: 'sender' | 'private' | 'group' | 'supergroup' | 'channel';
  chat_instance?: string;
  start_param?: string;
  can_send_after?: number;
  auth_date: number;
  hash: string;
  signature?: string;
}

interface ThemeParams {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
  header_bg_color?: string;
  bottom_bar_bg_color?: string;
  accent_text_color?: string;
  section_bg_color?: string;
  section_header_text_color?: string;
  section_separator_color?: string;
  subtitle_text_color?: string;
  destructive_text_color?: string;
}

interface BackButton {
  isVisible: boolean;
  onClick(callback: () => void): BackButton;
  offClick(callback: () => void): BackButton;
  show(): BackButton;
  hide(): BackButton;
}

interface BottomButton {
  type: 'main' | 'secondary';
  text: string;
  color: string;
  textColor: string;
  isVisible: boolean;
  isActive: boolean;
  hasShineEffect: boolean;
  position: 'left' | 'right' | 'top' | 'bottom';
  isProgressVisible: boolean;
  setText(text: string): BottomButton;
  onClick(callback: () => void): BottomButton;
  offClick(callback: () => void): BottomButton;
  show(): BottomButton;
  hide(): BottomButton;
  enable(): BottomButton;
  disable(): BottomButton;
  showProgress(leaveActive?: boolean): BottomButton;
  hideProgress(): BottomButton;
  setParams(params: {
    text?: string;
    color?: string;
    text_color?: string;
    has_shine_effect?: boolean;
    position?: 'left' | 'right' | 'top' | 'bottom';
    is_active?: boolean;
    is_visible?: boolean;
  }): BottomButton;
}

interface SettingsButton {
  isVisible: boolean;
  onClick(callback: () => void): SettingsButton;
  offClick(callback: () => void): SettingsButton;
  show(): SettingsButton;
  hide(): SettingsButton;
}

interface HapticFeedback {
  impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): HapticFeedback;
  notificationOccurred(type: 'error' | 'success' | 'warning'): HapticFeedback;
  selectionChanged(): HapticFeedback;
}

interface CloudStorage {
  setItem(key: string, value: string, callback?: (error: Error | null, success: boolean) => void): CloudStorage;
  getItem(key: string, callback: (error: Error | null, value: string) => void): CloudStorage;
  getItems(keys: string[], callback: (error: Error | null, values: string[]) => void): CloudStorage;
  removeItem(key: string, callback?: (error: Error | null, success: boolean) => void): CloudStorage;
  removeItems(keys: string[], callback?: (error: Error | null, success: boolean) => void): CloudStorage;
  getKeys(callback: (error: Error | null, keys: string[]) => void): CloudStorage;
}

interface BiometricRequestAccessParams {
  reason?: string;
}

interface BiometricAuthenticateParams {
  reason?: string;
}

interface BiometricManager {
  isInited: boolean;
  isBiometricAvailable: boolean;
  biometricType: 'finger' | 'face' | 'unknown';
  isAccessRequested: boolean;
  isAccessGranted: boolean;
  isBiometricTokenSaved: boolean;
  deviceId: string;
  init(callback?: () => void): BiometricManager;
  requestAccess(params: BiometricRequestAccessParams, callback?: (success: boolean) => void): BiometricManager;
  authenticate(params: BiometricAuthenticateParams, callback?: (success: boolean, token: string) => void): BiometricManager;
  updateBiometricToken(token: string, callback?: (success: boolean) => void): BiometricManager;
  openSettings(): BiometricManager;
}

interface AccelerometerStartParams {
  refresh_rate?: number;
}

interface Accelerometer {
  isStarted: boolean;
  x: number;
  y: number;
  z: number;
  start(params: AccelerometerStartParams, callback?: (success: boolean) => void): Accelerometer;
  stop(callback?: (success: boolean) => void): Accelerometer;
}

interface DeviceOrientationStartParams {
  refresh_rate?: number;
  need_absolute?: boolean;
}

interface DeviceOrientation {
  isStarted: boolean;
  absolute: boolean;
  alpha: number;
  beta: number;
  gamma: number;
  start(params: DeviceOrientationStartParams, callback?: (success: boolean) => void): DeviceOrientation;
  stop(callback?: (success: boolean) => void): DeviceOrientation;
}

interface GyroscopeStartParams {
  refresh_rate?: number;
}

interface Gyroscope {
  isStarted: boolean;
  x: number;
  y: number;
  z: number;
  start(params: GyroscopeStartParams, callback?: (success: boolean) => void): Gyroscope;
  stop(callback?: (success: boolean) => void): Gyroscope;
}

interface LocationData {
  latitude: number;
  longitude: number;
  altitude: number | null;
  course: number | null;
  speed: number | null;
  horizontal_accuracy: number | null;
  vertical_accuracy: number | null;
  course_accuracy: number | null;
  speed_accuracy: number | null;
}

interface LocationManager {
  isInited: boolean;
  isLocationAvailable: boolean;
  isAccessRequested: boolean;
  isAccessGranted: boolean;
  init(callback?: () => void): LocationManager;
  getLocation(callback: (error: Error | null, location: LocationData | null) => void): LocationManager;
  openSettings(): LocationManager;
}

interface DeviceStorage {
  setItem(key: string, value: string, callback?: (error: Error | null, success: boolean) => void): DeviceStorage;
  getItem(key: string, callback: (error: Error | null, value: string) => void): DeviceStorage;
  removeItem(key: string, callback?: (error: Error | null, success: boolean) => void): DeviceStorage;
  clear(callback?: (error: Error | null, success: boolean) => void): DeviceStorage;
}

interface SecureStorage {
  setItem(key: string, value: string, callback?: (error: Error | null, success: boolean) => void): SecureStorage;
  getItem(key: string, callback: (error: Error | null, value: string, restorable: boolean) => void): SecureStorage;
  restoreItem(key: string, callback?: (error: Error | null, value: string) => void): SecureStorage;
  removeItem(key: string, callback?: (error: Error | null, success: boolean) => void): SecureStorage;
  clear(callback?: (error: Error | null, success: boolean) => void): SecureStorage;
}

// Определим типы событий и их данные
interface ViewportChangedEvent {
  height: number;
  isStateStable: boolean;
}

interface InvoiceClosedEvent {
  status: string;
}

interface PopupClosedEvent {
  button_id: string | null;
}

// Типизация событий и их обработчиков
type TelegramEventHandler<T> = (data: T) => void;

// Типизация всех событий Telegram WebApp
type TelegramEventType =
  | 'themeChanged'
  | 'viewportChanged'
  | 'mainButtonClicked'
  | 'secondaryButtonClicked'
  | 'backButtonClicked'
  | 'settingsButtonClicked'
  | 'invoiceClosed'
  | 'popupClosed'
  | 'qrTextReceived'
  | 'scanQrPopupClosed'
  | 'clipboardTextReceived'
  | 'homeScreenAdded';

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: WebAppInitData;
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: ThemeParams;
  isActive: boolean;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  bottomBarColor: string;
  isClosingConfirmationEnabled: boolean;
  isVerticalSwipesEnabled: boolean;
  isFullscreen: boolean;
  isOrientationLocked: boolean;
  safeAreaInset: SafeAreaInset;
  contentSafeAreaInset: ContentSafeAreaInset;
  BackButton: BackButton;
  MainButton: BottomButton;
  SecondaryButton: BottomButton;
  SettingsButton: SettingsButton;
  HapticFeedback: HapticFeedback;
  CloudStorage: CloudStorage;
  BiometricManager: BiometricManager;
  Accelerometer: Accelerometer;
  DeviceOrientation: DeviceOrientation;
  Gyroscope: Gyroscope;
  LocationManager: LocationManager;
  DeviceStorage: DeviceStorage;
  SecureStorage: SecureStorage;

  isVersionAtLeast(version: string): boolean;
  setHeaderColor(color: string): void;
  setBackgroundColor(color: string): void;
  setBottomBarColor(color: string): void;
  enableClosingConfirmation(): void;
  disableClosingConfirmation(): void;
  enableVerticalSwipes(): void;
  disableVerticalSwipes(): void;
  requestFullscreen(): void;
  exitFullscreen(): void;
  lockOrientation(): void;
  unlockOrientation(): void;
  addToHomeScreen(): void;
  checkHomeScreenStatus(callback?: (status: 'unsupported' | 'unknown' | 'added' | 'missed') => void): void;
  onEvent(eventType: 'themeChanged', eventHandler: () => void): void;
  onEvent(eventType: 'viewportChanged', eventHandler: TelegramEventHandler<ViewportChangedEvent>): void;
  onEvent(eventType: 'mainButtonClicked', eventHandler: () => void): void;
  onEvent(eventType: 'secondaryButtonClicked', eventHandler: () => void): void;
  onEvent(eventType: 'backButtonClicked', eventHandler: () => void): void;
  onEvent(eventType: 'settingsButtonClicked', eventHandler: () => void): void;
  onEvent(eventType: 'invoiceClosed', eventHandler: TelegramEventHandler<InvoiceClosedEvent>): void;
  onEvent(eventType: 'popupClosed', eventHandler: TelegramEventHandler<PopupClosedEvent>): void;
  onEvent(eventType: 'qrTextReceived', eventHandler: TelegramEventHandler<string>): void;
  onEvent(eventType: 'scanQrPopupClosed', eventHandler: () => void): void;
  onEvent(eventType: 'clipboardTextReceived', eventHandler: TelegramEventHandler<string>): void;
  onEvent(eventType: 'homeScreenAdded', eventHandler: () => void): void;
  offEvent(eventType: 'themeChanged', eventHandler: () => void): void;
  offEvent(eventType: 'viewportChanged', eventHandler: TelegramEventHandler<ViewportChangedEvent>): void;
  offEvent(eventType: 'mainButtonClicked', eventHandler: () => void): void;
  offEvent(eventType: 'secondaryButtonClicked', eventHandler: () => void): void;
  offEvent(eventType: 'backButtonClicked', eventHandler: () => void): void;
  offEvent(eventType: 'settingsButtonClicked', eventHandler: () => void): void;
  offEvent(eventType: 'invoiceClosed', eventHandler: TelegramEventHandler<InvoiceClosedEvent>): void;
  offEvent(eventType: 'popupClosed', eventHandler: TelegramEventHandler<PopupClosedEvent>): void;
  offEvent(eventType: 'qrTextReceived', eventHandler: TelegramEventHandler<string>): void;
  offEvent(eventType: 'scanQrPopupClosed', eventHandler: () => void): void;
  offEvent(eventType: 'clipboardTextReceived', eventHandler: TelegramEventHandler<string>): void;
  offEvent(eventType: 'homeScreenAdded', eventHandler: () => void): void;
  sendData(data: string): void;
  switchInlineQuery(query: string, choose_chat_types?: string[]): void;
  openLink(url: string, options?: { try_instant_view?: boolean }): void;
  openTelegramLink(url: string): void;
  openInvoice(url: string, callback?: (status: string) => void): void;
  shareToStory(media_url: string, params?: StoryShareParams): void;
  shareMessage(msg_id: number, callback?: (success: boolean) => void): void;
  setEmojiStatus(custom_emoji_id: string, params?: EmojiStatusParams, callback?: (success: boolean) => void): void;
  requestEmojiStatusAccess(callback?: (success: boolean) => void): void;
  downloadFile(params: DownloadFileParams, callback?: (success: boolean) => void): void;
  showPopup(params: PopupParams, callback?: (buttonId: string) => void): void;
  showAlert(message: string, callback?: () => void): void;
  showConfirm(message: string, callback?: (confirmed: boolean) => void): void;
  showScanQrPopup(params: ScanQrPopupParams, callback?: (text: string) => boolean): void;
  closeScanQrPopup(): void;
  readTextFromClipboard(callback?: (text: string) => void): void;
  requestWriteAccess(callback?: (success: boolean) => void): void;
  requestContact(callback?: (success: boolean) => void): void;
  ready(): void;
  expand(): void;
  close(): void;
}

interface Window {
  Telegram: {
    WebApp: TelegramWebApp;
  };
}