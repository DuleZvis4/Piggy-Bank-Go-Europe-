import React, { useState, useEffect, useMemo, Component } from 'react';
import Fuse from 'fuse.js';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { 
  auth, 
  db, 
  googleProvider, 
  handleFirestoreError, 
  OperationType 
} from './firebase';
import { cn } from './lib/utils';
import { 
  PiggyBank, 
  CreditCard, 
  ArrowRightLeft, 
  History, 
  Plus, 
  LogOut, 
  ShieldCheck, 
  Globe,
  AlertCircle,
  Loader2,
  Euro,
  Trash2,
  Languages,
  MapPin,
  RefreshCw,
  Bell,
  Search,
  X,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Fingerprint,
  Zap,
  Info,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Activity,
  Cpu,
  Shield,
  Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Translations ---

const translations = {
  en: {
    serviceUnavailable: "Service Unavailable",
    onlyAvailableIn: "Piggy Bank Go is available to all users in the European region.",
    ensureLocation: "Please ensure location services are enabled and you are in a supported region.",
    secureSavings: "Secure savings for your region.",
    continueWithGoogle: "Continue with Google",
    cloudSyncEnabled: "Cloud Sync Enabled",
    totalSavings: "Total Savings",
    secureCloudSync: "Secure Cloud Sync",
    wallet: "Wallet",
    cards: "Cards",
    history: "History",
    quickTransfer: "Quick Transfer",
    selectCard: "Select Card",
    chooseCard: "Choose a card...",
    amount: "Amount",
    toPiggy: "To Piggy",
    toCard: "To Card",
    myCards: "My Cards",
    noCards: "No cards added yet.",
    addNewCard: "Add New Card",
    cardholderName: "Cardholder Name",
    cardNumber: "Card Number",
    expiryDate: "MM/YY",
    cvv: "CVV",
    saveCard: "Save Card",
    cancel: "Cancel",
    recentActivity: "Recent Activity",
    noTransactions: "No transactions yet.",
    deposit: "Deposit to Piggy",
    withdrawal: "Withdrawal to Card",
    insufficientBalance: "Insufficient balance in Piggy Bank",
    transferSuccess: "Transfer successful!",
    verifyingLocation: "Verifying location...",
    region: "Region",
    currency: "Currency",
    language: "Language",
    serbian: "Serbian",
    english: "English",
    changeCurrency: "Change Currency",
    selectCurrency: "Select Currency",
    quickDeposit: "Quick Deposit",
    confirmDeposit: "Confirm Deposit",
    paymentMethod: "Payment Method",
    selectProvider: "Select Provider",
    refreshLocation: "Refresh Location",
    locationAccess: "Location Access",
    locationVerified: "Location Verified",
    locationDenied: "Location Denied",
    detectingLocation: "Detecting your location...",
    notifications: "Notifications",
    notificationsEnabled: "Notifications Enabled",
    notificationsDisabled: "Notifications Disabled",
    enableNotifications: "Enable Notifications",
    depositSuccess: "Deposit Successful",
    withdrawalSuccess: "Withdrawal Successful",
    cardAdded: "Card Added Successfully",
    accountUpdate: "Account Update",
    selectRegion: "Select Region",
    manualLocation: "Manual Location",
    connectBank: "Connect Bank",
    selectBank: "Select Bank",
    bankAccount: "Bank Account",
    iban: "IBAN",
    swift: "SWIFT/BIC",
    bankConnected: "Bank Connected Successfully",
    allBanks: "All Banks",
    globalBanks: "Global Banks",
    europeanBanks: "European Banks",
    privacyMode: "Privacy Mode",
    stealthMode: "Stealth Mode",
    appLock: "App Lock",
    enterPin: "Enter PIN",
    setPin: "Set PIN",
    lockApp: "Lock App",
    unlockApp: "Unlock App",
    wrongPin: "Incorrect PIN",
    security: "Security",
    antiThief: "Anti-Thief Protection",
    autoLocation: "Auto-Location Access",
    locationDetected: "Location Detected",
    setNewPin: "Set New PIN",
    confirmPin: "Confirm PIN",
    pinMismatch: "PINs do not match",
    pinSetSuccess: "PIN set successfully",
    pinLengthError: "PIN must be 4 digits",
    save: "Save",
    connectingToBank: "Connecting to your bank...",
    verifyingCredentials: "Verifying credentials...",
    securingConnection: "Securing connection...",
    filter: "Filter",
    all: "All",
    deposits: "Deposits",
    withdrawals: "Withdrawals",
    startDate: "Start Date",
    endDate: "End Date",
    clearFilters: "Clear Filters",
    aboutApp: "About App",
    aboutDesc: "Piggy Bank Go Europe is your secure digital companion for managing savings across the European region. We provide bank-grade security and real-time cloud synchronization.",
    tutorial: "Tutorial",
    howItWorks: "How it Works",
    step1Title: "Connect your Bank",
    step1Desc: "Securely link your European or Global bank accounts to start saving.",
    step2Title: "Quick Transfers",
    step2Desc: "Move funds between your cards and piggy bank with a single tap.",
    step3Title: "Track History",
    step3Desc: "Monitor your savings with detailed transaction history and filters.",
    step4Title: "Stay Secure",
    step4Desc: "Enable App Lock and Stealth Mode to keep your balance private.",
    close: "Close",
    next: "Next",
    previous: "Previous",
    finish: "Finish",
    transactionDetails: "Transaction Details",
    status: "Status",
    referenceId: "Reference ID",
    date: "Date",
    time: "Time",
    securityCenter: "Security Center",
    antiHackStatus: "Anti-Hack Status",
    secure: "Secure",
    scanning: "Scanning...",
    integrityCheck: "Integrity Check",
    encryptionActive: "Encryption Active",
    firewallActive: "Firewall Active",
    biometricReady: "Biometric Ready",
    completed: "Completed",
    failed: "Failed",
    scanNow: "Scan Now",
    antiHackActive: "Anti-Hack System Active",
    systemSecure: "System Secure",
    encryption: "Encryption",
    firewall: "Firewall",
    biometrics: "Biometrics",
    recentSecurityEvents: "Recent Security Events",
    antiThiefProtection: "Anti-Thief Protection",
    automatic: "Automatic",
    active: "Active",
    inactive: "Inactive",
    financialInsights: "Financial Insights",
    settings: "Settings",
    tipLowBalance: "Start small! Even 5€ a week adds up to 260€ a year.",
    tipHighBalance: "Great job! Consider diversifying your savings.",
    tipRegionalRSD: "Dinars are stable, but consider keeping some EUR for travel.",
    tipRegionalGBP: "High interest rates in the UK? Check if your linked bank matches.",
    tipGeneral: "Consistency is key. Set a weekly deposit goal.",
  },
  sr: {
    serviceUnavailable: "Usluga nedostupna",
    onlyAvailableIn: "Piggy Bank Go je dostupan svim korisnicima u evropskom regionu.",
    ensureLocation: "Molimo proverite da li su usluge lokacije omogućene i da li ste u podržanom regionu.",
    secureSavings: "Sigurna štednja za vaš region.",
    continueWithGoogle: "Nastavi sa Google-om",
    cloudSyncEnabled: "Sinhronizacija u oblaku omogućena",
    totalSavings: "Ukupna štednja",
    secureCloudSync: "Sigurna sinhronizacija",
    wallet: "Novčanik",
    cards: "Kartice",
    history: "Istorija",
    quickTransfer: "Brzi prenos",
    selectCard: "Izaberi karticu",
    chooseCard: "Izaberite karticu...",
    amount: "Iznos",
    toPiggy: "U kasicu",
    toCard: "Na karticu",
    myCards: "Moje kartice",
    noCards: "Još niste dodali kartice.",
    addNewCard: "Dodaj novu karticu",
    cardholderName: "Ime vlasnika kartice",
    cardNumber: "Broj kartice",
    expiryDate: "MM/GG",
    cvv: "CVV",
    saveCard: "Sačuvaj karticu",
    cancel: "Otkaži",
    recentActivity: "Nedavne aktivnosti",
    noTransactions: "Još nema transakcija.",
    deposit: "Uplata u kasicu",
    withdrawal: "Isplata na karticu",
    insufficientBalance: "Nedovoljno sredstava u kasici",
    transferSuccess: "Prenos uspešan!",
    verifyingLocation: "Provera lokacije...",
    region: "Region",
    currency: "Valuta",
    language: "Jezik",
    serbian: "Srpski",
    english: "Engleski",
    changeCurrency: "Promeni valutu",
    selectCurrency: "Izaberi valutu",
    quickDeposit: "Brza uplata",
    confirmDeposit: "Potvrdi uplatu",
    paymentMethod: "Način plaćanja",
    selectProvider: "Izaberi provajdera",
    refreshLocation: "Osveži lokaciju",
    locationAccess: "Pristup lokaciji",
    locationVerified: "Lokacija potvrđena",
    locationDenied: "Pristup lokaciji odbijen",
    detectingLocation: "Detektovanje vaše lokacije...",
    notifications: "Obaveštenja",
    notificationsEnabled: "Obaveštenja omogućena",
    notificationsDisabled: "Obaveštenja onemogućena",
    enableNotifications: "Omogući obaveštenja",
    depositSuccess: "Uplata uspešna",
    withdrawalSuccess: "Isplata uspešna",
    cardAdded: "Kartica uspešno dodata",
    accountUpdate: "Ažuriranje naloga",
    selectRegion: "Izaberi region",
    manualLocation: "Ručna lokacija",
    connectBank: "Poveži banku",
    selectBank: "Izaberi banku",
    bankAccount: "Bankovni račun",
    iban: "IBAN",
    swift: "SWIFT/BIC",
    bankConnected: "Banka uspešno povezana",
    allBanks: "Sve banke",
    globalBanks: "Globalne banke",
    europeanBanks: "Evropske banke",
    privacyMode: "Privatni režim",
    stealthMode: "Skriveni režim",
    appLock: "Zaključavanje aplikacije",
    enterPin: "Unesi PIN",
    setPin: "Postavi PIN",
    lockApp: "Zaključaj aplikaciju",
    unlockApp: "Otključaj aplikaciju",
    wrongPin: "Pogrešan PIN",
    security: "Bezbednost",
    antiThief: "Anti-lopov zaštita",
    autoLocation: "Automatski pristup lokaciji",
    locationDetected: "Lokacija detektovana",
    setNewPin: "Postavi novi PIN",
    confirmPin: "Potvrdi PIN",
    pinMismatch: "PIN-ovi se ne podudaraju",
    pinSetSuccess: "PIN uspešno postavljen",
    pinLengthError: "PIN mora imati 4 cifre",
    save: "Sačuvaj",
    connectingToBank: "Povezivanje sa bankom...",
    verifyingCredentials: "Provera podataka...",
    securingConnection: "Osiguravanje veze...",
    filter: "Filter",
    all: "Sve",
    deposits: "Uplate",
    withdrawals: "Isplate",
    startDate: "Početni datum",
    endDate: "Krajnji datum",
    clearFilters: "Očisti filtere",
    aboutApp: "O aplikaciji",
    aboutDesc: "Piggy Bank Go Europe je vaš sigurni digitalni pratilac za upravljanje štednjom širom evropskog regiona. Pružamo sigurnost bankarskog nivoa i sinhronizaciju u oblaku u realnom vremenu.",
    tutorial: "Tutorijal",
    howItWorks: "Kako funkcioniše",
    step1Title: "Povežite svoju banku",
    step1Desc: "Sigurno povežite svoje evropske ili globalne bankovne račune da biste počeli da štedite.",
    step2Title: "Brzi transferi",
    step2Desc: "Prebacite sredstva između svojih kartica i kasice jednim dodirom.",
    step3Title: "Pratite istoriju",
    step3Desc: "Pratite svoju štednju uz detaljnu istoriju transakcija i filtere.",
    step4Title: "Ostanite sigurni",
    step4Desc: "Omogućite zaključavanje aplikacije i skriveni režim da biste sačuvali privatnost svog salda.",
    close: "Zatvori",
    next: "Sledeće",
    previous: "Prethodno",
    finish: "Završi",
    transactionDetails: "Detalji transakcije",
    status: "Status",
    referenceId: "Referentni ID",
    date: "Datum",
    time: "Vreme",
    securityCenter: "Bezbednosni centar",
    antiHackStatus: "Anti-Hack status",
    secure: "Sigurno",
    scanning: "Skeniranje...",
    integrityCheck: "Provera integriteta",
    encryptionActive: "Enkripcija aktivna",
    firewallActive: "Firewall aktivan",
    biometricReady: "Biometrija spremna",
    completed: "Završeno",
    failed: "Neuspešno",
    scanNow: "Skeniraj sada",
    antiHackActive: "Anti-Hack sistem aktivan",
    systemSecure: "Sistem siguran",
    encryption: "Enkripcija",
    firewall: "Firewall",
    biometrics: "Biometrija",
    recentSecurityEvents: "Nedavni bezbednosni događaji",
    antiThiefProtection: "Anti-lopov zaštita",
    automatic: "Automatski",
    active: "Aktivno",
    inactive: "Neaktivno",
    financialInsights: "Finansijski uvidi",
    settings: "Podešavanja",
    tipLowBalance: "Počnite polako! Čak i 5€ nedeljno donosi 260€ godišnje.",
    tipHighBalance: "Odličan posao! Razmislite o diversifikaciji štednje.",
    tipRegionalRSD: "Dinari su stabilni, ali razmislite o čuvanju evra za putovanja.",
    tipRegionalGBP: "Visoke kamate u UK? Proverite da li vaša banka to prati.",
    tipGeneral: "Doslednost je ključ. Postavite nedeljni cilj štednje.",
  }
};

type Language = 'en' | 'sr';

// --- Types ---

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  balance: number; // Stored in EUR
  preferredCurrency?: string;
  isStealthMode?: boolean;
  appPin?: string;
  isAppLockEnabled?: boolean;
  createdAt: Timestamp;
}

interface Card {
  id: string;
  uid: string;
  cardName: string;
  cardNumber: string; // Or IBAN for banks
  expiryDate: string; // Or SWIFT for banks
  cvv: string;
  type: 'CARD' | 'PAYPAL' | 'WISE' | 'BANK';
  provider: 'VISA' | 'MASTERCARD' | 'MAESTRO' | 'PAYPAL' | 'WISE' | string; // Bank name if type is BANK
  createdAt: Timestamp;
}

interface Transaction {
  id: string;
  uid: string;
  amount: number; // Original amount
  currency: string; // Original currency
  amountEur: number; // Amount in EUR
  type: 'TO_PIGGY' | 'FROM_PIGGY';
  timestamp: Timestamp;
  status: 'COMPLETED' | 'FAILED';
}

// --- Constants ---

const EXCHANGE_RATES: Record<string, number> = {
  EUR: 1,
  RSD: 117.2,
  USD: 1.08,
  GBP: 0.85,
  CHF: 0.98,
  SEK: 11.25,
  NOK: 11.45,
  DKK: 7.45,
  PLN: 4.32,
  CZK: 25.30,
  HUF: 395.50,
  RON: 4.97,
  BGN: 1.95,
  ISK: 150.20,
  ALL: 102.50,
  BAM: 1.95,
  MKD: 61.50,
  MDL: 19.20,
  UAH: 42.50,
  BYN: 3.50,
  GEL: 2.90,
  AMD: 420.00,
  AZN: 1.83,
  TRY: 35.00,
  RUB: 100.00,
  KZT: 480.00,
};

const SUPPORTED_CURRENCIES = ['EUR', 'RSD', 'USD', 'GBP', 'CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'ISK', 'ALL', 'BAM', 'MKD', 'MDL', 'UAH', 'BYN', 'GEL', 'AMD', 'AZN', 'TRY', 'RUB', 'KZT'];

const EUROPEAN_REGIONS = [
  { country: 'Serbia', currency: 'RSD' },
  { country: 'Montenegro', currency: 'EUR' },
  { country: 'Croatia', currency: 'EUR' },
  { country: 'Germany', currency: 'EUR' },
  { country: 'France', currency: 'EUR' },
  { country: 'Italy', currency: 'EUR' },
  { country: 'Spain', currency: 'EUR' },
  { country: 'United Kingdom', currency: 'GBP' },
  { country: 'Switzerland', currency: 'CHF' },
  { country: 'Austria', currency: 'EUR' },
  { country: 'Netherlands', currency: 'EUR' },
  { country: 'Belgium', currency: 'EUR' },
  { country: 'Sweden', currency: 'SEK' },
  { country: 'Norway', currency: 'NOK' },
  { country: 'Denmark', currency: 'DKK' },
  { country: 'Poland', currency: 'PLN' },
  { country: 'Portugal', currency: 'EUR' },
  { country: 'Ireland', currency: 'EUR' },
  { country: 'Finland', currency: 'EUR' },
  { country: 'Greece', currency: 'EUR' },
  { country: 'Czech Republic', currency: 'CZK' },
  { country: 'Hungary', currency: 'HUF' },
  { country: 'Romania', currency: 'RON' },
  { country: 'Bulgaria', currency: 'BGN' },
  { country: 'Slovakia', currency: 'EUR' },
  { country: 'Slovenia', currency: 'EUR' },
  { country: 'Estonia', currency: 'EUR' },
  { country: 'Latvia', currency: 'EUR' },
  { country: 'Lithuania', currency: 'EUR' },
  { country: 'Luxembourg', currency: 'EUR' },
  { country: 'Malta', currency: 'EUR' },
  { country: 'Cyprus', currency: 'EUR' },
  { country: 'Iceland', currency: 'ISK' },
  { country: 'Albania', currency: 'ALL' },
  { country: 'Bosnia and Herzegovina', currency: 'BAM' },
  { country: 'North Macedonia', currency: 'MKD' },
  { country: 'Kosovo', currency: 'EUR' },
  { country: 'Moldova', currency: 'MDL' },
  { country: 'Ukraine', currency: 'UAH' },
  { country: 'Belarus', currency: 'BYN' },
  { country: 'Georgia', currency: 'GEL' },
  { country: 'Armenia', currency: 'AMD' },
  { country: 'Azerbaijan', currency: 'AZN' },
  { country: 'Monaco', currency: 'EUR' },
  { country: 'San Marino', currency: 'EUR' },
  { country: 'Vatican City', currency: 'EUR' },
  { country: 'Liechtenstein', currency: 'CHF' },
  { country: 'Andorra', currency: 'EUR' },
  { country: 'Turkey', currency: 'TRY' },
  { country: 'Russia', currency: 'RUB' },
  { country: 'Kazakhstan', currency: 'KZT' },
];

const MAJOR_BANKS = {
  EUROPE: [
    'Deutsche Bank', 'Commerzbank', 'Postbank', 'LBBW', 'DZ Bank', 'HSBC', 'BNP Paribas', 
    'Crédit Agricole', 'Société Générale', 'Natixis', 'BPCE', 'Santander', 'BBVA', 
    'CaixaBank', 'Banco Sabadell', 'Intesa Sanpaolo', 'UniCredit', 'Mediobanca', 
    'ING Group', 'ABN AMRO', 'Rabobank', 'UBS', 'Credit Suisse', 'Barclays', 
    'Lloyds Bank', 'NatWest', 'Standard Chartered', 'Nordea', 'Danske Bank', 
    'Jyske Bank', 'Nykredit', 'SEB', 'Swedbank', 'Handelsbanken', 'DNB', 'SpareBank 1',
    'PKO Bank Polski', 'Bank Pekao', 'mBank', 'Česká spořitelna', 'Komerční banka', 
    'ČSOB', 'OTP Bank', 'Banca Transilvania', 'BCR', 'BRD', 'DSK Bank', 'UniCredit Bulbank',
    'VUB Banka', 'Tatra banka', 'NLB Bank', 'Bank of Ireland', 'AIB', 'Millennium BCP', 
    'Novo Banco', 'National Bank of Greece', 'Piraeus Bank', 'Alpha Bank', 'Eurobank',
    'Landsbankinn', 'Arion Banki', 'Islandsbanki', 'Raiffeisen Bank', 'Erste Bank', 
    'Komercijalna Banka', 'CKB GO (Montenegro)', 'Hipotekarna Banka (Montenegro)', 
    'Prva Banka (Montenegro)', 'Banca Intesa (Serbia)', 'AIK Banka (Serbia)', 
    'Zagrebačka Banka (Croatia)', 'PBZ (Croatia)', 'Bank of Albania', 'Raiffeisen Albania',
    'BKT (Albania)', 'Intesa Sanpaolo Albania', 'UniCredit Mostar (BiH)', 'Raiffeisen BiH',
    'Intesa Sanpaolo BiH', 'Komercijalna Banka Skopje', 'Stopanska Banka', 'NLB Skopje',
    'Raiffeisen Kosovo', 'NLB Prishtina', 'TEB Kosovo', 'Moldova Agroindbank', 'Victoriabank',
    'PrivatBank (Ukraine)', 'Oschadbank', 'Raiffeisen Ukraine', 'Bank of Georgia', 'TBC Bank',
    'Ameriabank', 'Ardshinbank', 'International Bank of Azerbaijan', 'PASHA Bank'
  ],
  GLOBAL: [
    'JPMorgan Chase', 'Bank of America', 'ICBC', 'Wells Fargo', 'Citigroup',
    'Mitsubishi UFJ', 'China Construction Bank', 'Agricultural Bank of China',
    'Bank of China', 'TD Bank', 'Royal Bank of Canada', 'DBS Bank', 'Standard Bank'
  ]
};

const convertToEur = (amount: number, from: string) => {
  const rate = EXCHANGE_RATES[from] || 1;
  return amount / rate;
};

const convertFromEur = (amount: number, to: string) => {
  const rate = EXCHANGE_RATES[to] || 1;
  return amount * rate;
};

// --- Error Boundary ---

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };
  props: ErrorBoundaryProps;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "An unexpected error occurred.";
      try {
        const parsed = JSON.parse(this.state.error.message);
        errorMessage = `Firestore Error: ${parsed.operationType} on ${parsed.path} failed.`;
      } catch (e) {
        errorMessage = this.state.error.message || errorMessage;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-red-100">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Components ---

const LoadingScreen = ({ message }: { message: string }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
    <p className="text-gray-600 font-medium">{message}</p>
  </div>
);

// --- Main App ---

export default function App() {
  return (
    <ErrorBoundary>
      <PiggyBankApp />
    </ErrorBoundary>
  );
}

function PiggyBankApp() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [region, setRegion] = useState<{ country: string; currency: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'wallet' | 'cards' | 'history' | 'settings'>('wallet');
  const [showAddCard, setShowAddCard] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [selectedCardId, setSelectedCardId] = useState('');
  const [lang, setLang] = useState<Language>('en');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showRegionSelector, setShowRegionSelector] = useState(false);
  const [showConnectBank, setShowConnectBank] = useState(false);
  const [bankSearch, setBankSearch] = useState('');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [connectingBank, setConnectingBank] = useState(false);
  const [connectionStep, setConnectionStep] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [hasInitialLockChecked, setHasInitialLockChecked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinSetupStep, setPinSetupStep] = useState(0); // 0: Set, 1: Confirm
  const [pinError, setPinError] = useState('');
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [historyTypeFilter, setHistoryTypeFilter] = useState<'ALL' | 'TO_PIGGY' | 'FROM_PIGGY'>('ALL');
  const [historyStartDate, setHistoryStartDate] = useState('');
  const [historyEndDate, setHistoryEndDate] = useState('');

  const allBanks = useMemo(() => [...MAJOR_BANKS.EUROPE, ...MAJOR_BANKS.GLOBAL], []);
  const fuse = useMemo(() => new Fuse(allBanks, { 
    threshold: 0.3,
    distance: 100,
    location: 0,
    includeScore: true
  }), [allBanks]);

  const [pinLengthError, setPinLengthError] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showAbout, setShowAbout] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showSecurityCenter, setShowSecurityCenter] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const searchResults = useMemo(() => {
    if (!bankSearch) return [];
    return fuse.search(bankSearch).map(result => result.item);
  }, [fuse, bankSearch]);

  const t = translations[lang];

  const financialTip = useMemo(() => {
    if (!profile) return t.tipGeneral;
    
    // Regional tips
    if (region?.country === 'Serbia' || region?.country === 'Montenegro') return t.tipRegionalRSD;
    if (region?.country === 'United Kingdom') return t.tipRegionalGBP;

    // Balance-based tips
    if (profile.balance < 50) return t.tipLowBalance;
    if (profile.balance > 1000) return t.tipHighBalance;

    return t.tipGeneral;
  }, [profile, region, t]);

  const tutorialSteps = [
    {
      title: lang === 'sr' ? 'Dobrodošli u Piggy Bank Go' : 'Welcome to Piggy Bank Go',
      description: lang === 'sr' ? 'Vaša sigurna kasica za štednju u Evropi. Naučite kako da koristite aplikaciju u nekoliko koraka.' : 'Your secure savings piggy bank in Europe. Learn how to use the app in a few steps.',
      icon: <PiggyBank className="w-12 h-12 text-blue-600" />
    },
    {
      title: lang === 'sr' ? 'Povežite svoje kartice' : 'Connect Your Cards',
      description: lang === 'sr' ? 'Dodajte svoje bankovne kartice ili povežite bankovni račun za brze transfere.' : 'Add your bank cards or connect a bank account for quick transfers.',
      icon: <CreditCard className="w-12 h-12 text-blue-600" />
    },
    {
      title: lang === 'sr' ? 'Štedite pametno' : 'Save Smart',
      description: lang === 'sr' ? 'Prebacite novac sa kartice u kasicu jednim klikom koristeći brze iznose.' : 'Transfer money from your card to the piggy bank with one click using quick amounts.',
      icon: <Zap className="w-12 h-12 text-blue-600" />
    },
    {
      title: lang === 'sr' ? 'Bezbednost na prvom mestu' : 'Security First',
      description: lang === 'sr' ? 'Koristite App Lock, Stealth Mode i Security Center da zaštitite svoje finansije.' : 'Use App Lock, Stealth Mode, and Security Center to protect your finances.',
      icon: <ShieldCheck className="w-12 h-12 text-blue-600" />
    }
  ];

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "granted") {
      setNotificationsEnabled(true);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setNotificationsEnabled(true);
    }
  };

  const showNotification = (title: string, body: string) => {
    if (notificationsEnabled && Notification.permission === "granted") {
      new Notification(title, { body });
    }
  };

  const currentCurrency = useMemo(() => {
    return profile?.preferredCurrency || region?.currency || 'EUR';
  }, [profile, region]);

  const currencyFormatter = useMemo(() => {
    return new Intl.NumberFormat(lang === 'sr' ? 'sr-RS' : 'en-GB', {
      style: 'currency',
      currency: currentCurrency,
    });
  }, [currentCurrency, lang]);

  const displayBalance = useMemo(() => {
    if (!profile) return 0;
    return convertFromEur(profile.balance, currentCurrency);
  }, [profile, currentCurrency]);

  const maskedBalance = "****";

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesType = historyTypeFilter === 'ALL' || tx.type === historyTypeFilter;
      
      let matchesDate = true;
      if (tx.timestamp) {
        const txDate = tx.timestamp.toDate();
        if (historyStartDate) {
          const start = new Date(historyStartDate);
          start.setHours(0, 0, 0, 0);
          if (txDate < start) matchesDate = false;
        }
        if (historyEndDate) {
          const end = new Date(historyEndDate);
          end.setHours(23, 59, 59, 999);
          if (txDate > end) matchesDate = false;
        }
      }
      
      return matchesType && matchesDate;
    });
  }, [transactions, historyTypeFilter, historyStartDate, historyEndDate]);

  const toggleStealthMode = async () => {
    if (!user || !profile) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        isStealthMode: !profile.isStealthMode
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const handlePinSubmit = () => {
    if (profile?.appPin === pinInput) {
      setIsLocked(false);
      setPinInput('');
      setPinError('');
    } else {
      setPinError(t.wrongPin);
      setPinInput('');
    }
  };

  const handleSetPin = async () => {
    if (pinSetupStep === 0) {
      if (newPin.length !== 4) {
        setPinError(t.pinLengthError);
        return;
      }
      setPinError('');
      setPinSetupStep(1);
      return;
    }

    if (newPin !== confirmPin) {
      setPinError(t.pinMismatch);
      return;
    }
    if (!user) return;

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        appPin: newPin,
        isAppLockEnabled: true
      });
      setShowPinSetup(false);
      setNewPin('');
      setConfirmPin('');
      setPinError('');
      setPinSetupStep(0);
      showNotification(t.security, t.pinSetSuccess);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const toggleAppLock = async () => {
    if (!user || !profile) return;
    if (!profile.appPin) {
      setPinSetupStep(0);
      setShowPinSetup(true);
      return;
    }
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        isAppLockEnabled: !profile.isAppLockEnabled
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const detectLocation = async () => {
    setDetectingLocation(true);
    try {
      // Use standard Geolocation API
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        // Simple reverse geocoding using a free API (no key needed for basic usage)
        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
        const data = await response.json();
        
        const countryName = data.countryName;
        const continentCode = data.continentCode;
        let matchedRegion = EUROPEAN_REGIONS.find(r => r.country.toLowerCase() === countryName.toLowerCase());
        
        // Fallback for any European country not explicitly listed
        if (!matchedRegion && continentCode === 'EU') {
          matchedRegion = { country: countryName, currency: 'EUR' };
        }

        if (matchedRegion) {
          setRegion(matchedRegion);
          showNotification(t.locationDetected, `${matchedRegion.country} (${matchedRegion.currency})`);
        }
        setDetectingLocation(false);
      }, (error) => {
        console.error("Geolocation error:", error);
        setDetectingLocation(false);
      });
    } catch (error) {
      console.error("Detection error:", error);
      setDetectingLocation(false);
    }
  };

  useEffect(() => {
    if (profile?.isAppLockEnabled && !isLocked) {
      setIsLocked(true);
    }
  }, [profile?.isAppLockEnabled]);

  useEffect(() => {
    if (isAuthReady && !region && !detectingLocation) {
      detectLocation();
    }
  }, [isAuthReady]);

  const refreshLocation = () => {
    setLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const inEurope = latitude >= 34 && latitude <= 72 && longitude >= -25 && longitude <= 45;
          if (inEurope) {
            let country = "Europe";
            let currency = "EUR";
            if (latitude >= 42 && latitude <= 46 && longitude >= 18 && longitude <= 23) {
              country = "Serbia";
              currency = "RSD";
            } else if (latitude >= 41 && latitude <= 44 && longitude >= 18 && longitude <= 21) {
              country = "Montenegro";
              currency = "EUR";
            } else if (latitude >= 42 && latitude <= 47 && longitude >= 13 && longitude <= 20) {
              country = "Croatia";
              currency = "EUR";
            }
            setRegion({ country, currency });
          } else {
            setRegion(null);
          }
          setLoading(false);
        },
        (err) => {
          console.error("Geo permission denied", err);
          setRegion(null);
          setLoading(false);
        }
      );
    } else {
      setRegion(null);
      setLoading(false);
    }
  };

  // 1. Auth & Geolocation
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAuthReady(true);
    });

    refreshLocation();

    return () => unsubscribe();
  }, []);

  // 2. Firestore Sync
  useEffect(() => {
    if (!user || !isAuthReady) return;

    const userDocRef = doc(db, 'users', user.uid);
    const cardsColRef = collection(db, 'users', user.uid, 'cards');
    const transColRef = collection(db, 'users', user.uid, 'transactions');

    const unsubProfile = onSnapshot(userDocRef, (snap) => {
      if (snap.exists()) {
        setProfile(snap.data() as UserProfile);
      } else {
        // Initialize user profile
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'User',
          balance: 0,
          preferredCurrency: region?.currency || 'EUR',
          createdAt: Timestamp.now(),
        };
        setDoc(userDocRef, newProfile).catch(e => handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}`));
      }
    }, (e) => handleFirestoreError(e, OperationType.GET, `users/${user.uid}`));

    const unsubCards = onSnapshot(cardsColRef, (snap) => {
      setCards(snap.docs.map(d => ({ id: d.id, ...d.data() } as Card)));
    }, (e) => handleFirestoreError(e, OperationType.GET, `users/${user.uid}/cards`));

    const unsubTrans = onSnapshot(query(transColRef, orderBy('timestamp', 'desc'), limit(100)), (snap) => {
      setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() } as Transaction)));
    }, (e) => handleFirestoreError(e, OperationType.GET, `users/${user.uid}/transactions`));

    return () => {
      unsubProfile();
      unsubCards();
      unsubTrans();
    };
  }, [user, isAuthReady]);

  useEffect(() => {
    if (profile && !hasInitialLockChecked) {
      if (profile.isAppLockEnabled) {
        setIsLocked(true);
      }
      setHasInitialLockChecked(true);
    }
  }, [profile, hasInitialLockChecked]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const handleLogout = () => signOut(auth);

  const handleAddCard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.currentTarget);
    const provider = formData.get('provider') as string;
    const type = formData.get('type') as Card['type'] || 'CARD';

    if (type === 'BANK') {
      setConnectingBank(true);
      setConnectionStep(0);
      // Simulate connection steps
      for (let i = 1; i <= 3; i++) {
        await new Promise(r => setTimeout(r, 1200));
        setConnectionStep(i);
      }
    }

    const newCard: any = {
      uid: user.uid,
      cardName: formData.get('cardName') as string,
      type,
      provider,
      createdAt: serverTimestamp(),
    };

    if (type === 'BANK') {
      newCard.cardNumber = formData.get('cardNumber') as string; // IBAN
      newCard.expiryDate = formData.get('expiryDate') as string; // SWIFT/BIC
      newCard.cvv = '';
    } else {
      newCard.cardNumber = formData.get('cardNumber') as string;
      newCard.expiryDate = formData.get('expiryDate') as string;
      newCard.cvv = formData.get('cvv') as string;
    }

    try {
      await addDoc(collection(db, 'users', user.uid, 'cards'), newCard);
      setConnectingBank(false);
      setConnectionStep(0);
      setShowAddCard(false);
      setShowConnectBank(false);
      setBankSearch('');
      setSelectedBank(null);
      showNotification(type === 'BANK' ? t.bankConnected : t.cardAdded, `${newCard.cardName}`);
    } catch (e) {
      setConnectingBank(false);
      handleFirestoreError(e, OperationType.CREATE, `users/${user.uid}/cards`);
    }
  };

  const handleManualRegion = (reg: { country: string; currency: string }) => {
    setRegion(reg);
    setShowRegionSelector(false);
    if (reg.country === 'Serbia' || reg.country === 'Montenegro') {
      setLang('sr');
    } else {
      setLang('en');
    }
  };

  const handleQuickDeposit = async (amount: number) => {
    if (!user || !profile || cards.length === 0) {
      if (cards.length === 0) alert(t.noCards);
      return;
    }
    
    const cardId = selectedCardId || cards[0].id;
    if (!selectedCardId) setSelectedCardId(cardId);

    const amountEur = convertToEur(amount, currentCurrency);

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const transColRef = collection(db, 'users', user.uid, 'transactions');

      const newBalance = profile.balance + amountEur;

      await updateDoc(userDocRef, { balance: newBalance });
      await addDoc(transColRef, {
        uid: user.uid,
        amount,
        currency: currentCurrency,
        amountEur,
        type: 'TO_PIGGY',
        timestamp: serverTimestamp(),
        status: 'COMPLETED'
      });

      const formatted = currencyFormatter.format(amount);
      showNotification(t.depositSuccess, formatted);
      alert(`${t.transferSuccess} ${formatted}`);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  const handleTransfer = async (type: 'TO_PIGGY' | 'FROM_PIGGY') => {
    if (!user || !profile || !selectedCardId || !transferAmount) return;
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) return;

    const amountEur = convertToEur(amount, currentCurrency);

    if (type === 'FROM_PIGGY' && profile.balance < amountEur) {
      alert(t.insufficientBalance);
      return;
    }

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const transColRef = collection(db, 'users', user.uid, 'transactions');

      const newBalance = type === 'TO_PIGGY' ? profile.balance + amountEur : profile.balance - amountEur;

      await updateDoc(userDocRef, { balance: newBalance });
      await addDoc(transColRef, {
        uid: user.uid,
        amount,
        currency: currentCurrency,
        amountEur,
        type,
        timestamp: serverTimestamp(),
        status: 'COMPLETED'
      });

      setTransferAmount('');
      const formatted = currencyFormatter.format(amount);
      const title = type === 'TO_PIGGY' ? t.depositSuccess : t.withdrawalSuccess;
      showNotification(title, formatted);
      alert(`${t.transferSuccess} ${formatted}`);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  const handleCurrencyChange = async (newCurrency: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        preferredCurrency: newCurrency
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  const toggleLang = () => setLang(prev => prev === 'en' ? 'sr' : 'en');

  if (loading) return <LoadingScreen message={t.verifyingLocation} />;

  if (!region) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-blue-100">
          <Globe className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.serviceUnavailable}</h2>
          <p className="text-gray-600 mb-6">{t.onlyAvailableIn}</p>
          <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-700 text-left flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{t.ensureLocation}</p>
          </div>
          <button 
            onClick={toggleLang}
            className="mt-6 flex items-center gap-2 mx-auto text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Languages className="w-4 h-4" />
            {lang === 'en' ? 'Srpski' : 'English'}
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full text-center relative"
        >
          <button 
            onClick={toggleLang}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Languages className="w-6 h-6" />
          </button>

          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
            <PiggyBank className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Piggy Bank Go</h1>
          <p className="text-gray-500 mb-8">{t.secureSavings}</p>
          
          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 py-4 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 transition-all active:scale-95"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            {t.continueWithGoogle}
          </button>
          
          <p className="mt-8 text-xs text-gray-400 uppercase tracking-widest font-bold">
            {t.cloudSyncEnabled}
          </p>
        </motion.div>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl text-center"
        >
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Lock className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.unlockApp}</h2>
          <p className="text-gray-500 text-sm mb-8">{t.enterPin}</p>
          
          <div className="flex justify-center gap-3 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <div 
                key={i}
                className={cn(
                  "w-4 h-4 rounded-full border-2 transition-all",
                  pinInput.length > i ? "bg-blue-600 border-blue-600 scale-125" : "border-gray-200"
                )}
              />
            ))}
          </div>

          {pinError && <p className="text-red-500 text-xs font-bold mb-6 animate-bounce">{pinError}</p>}

          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'OK'].map((val) => (
              <button
                key={val.toString()}
                onClick={() => {
                  if (val === 'C') {
                    setPinInput('');
                  } else if (val === 'OK') {
                    handlePinSubmit();
                  } else if (pinInput.length < 4) {
                    setPinInput(prev => prev + val);
                  }
                }}
                className={cn(
                  "h-16 rounded-2xl font-bold text-xl transition-all flex items-center justify-center",
                  val === 'OK' ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                )}
              >
                {val}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <PiggyBank className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Piggy Bank Go</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={requestNotificationPermission}
            className={cn(
              "p-2 transition-colors",
              notificationsEnabled ? "text-blue-600" : "text-gray-400 hover:text-blue-600"
            )}
            title={notificationsEnabled ? t.notificationsEnabled : t.enableNotifications}
          >
            <Bell className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setShowTutorial(true)}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            title={t.tutorial}
          >
            <BookOpen className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setShowAbout(true)}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            title={t.aboutApp}
          >
            <Info className="w-6 h-6" />
          </button>
          <button 
            onClick={toggleLang}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            title={t.language}
          >
            <Languages className="w-6 h-6" />
          </button>
          {profile?.isAppLockEnabled && (
            <button 
              onClick={() => setIsLocked(true)}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              title={t.lockApp}
            >
              <Lock className="w-6 h-6" />
            </button>
          )}
          <div className="flex items-center gap-1 border-l border-gray-100 pl-2">
            <Globe className="w-4 h-4 text-gray-300" />
            <select 
              value={currentCurrency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="bg-transparent text-gray-500 text-[10px] font-bold uppercase tracking-widest focus:outline-none cursor-pointer hover:text-blue-600 transition-colors appearance-none"
            >
              {SUPPORTED_CURRENCIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto p-6 space-y-6">
        {/* Balance Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden"
        >
          <div className="relative z-10">
            <p className="text-gray-400 text-sm font-medium mb-1">{t.totalSavings}</p>
            <h2 className="text-5xl font-light tracking-tight mb-6">
              {profile?.isStealthMode ? maskedBalance : (profile ? currencyFormatter.format(displayBalance) : currencyFormatter.format(0))}
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                {t.secureCloudSync}
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase">
                <MapPin className="w-3 h-3" />
                {region.country}
              </div>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl" />
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto scrollbar-hide">
          {(['wallet', 'cards', 'history', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 min-w-[80px] py-3 rounded-xl text-sm font-semibold transition-all capitalize",
                activeTab === tab ? "bg-gray-900 text-white shadow-md" : "text-gray-500 hover:text-gray-900"
              )}
            >
              {t[tab as keyof typeof t]}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'wallet' && (
            <motion.div 
              key="wallet"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              {/* Quick Deposit Row */}
              {cards.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.quickDeposit}</h4>
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{currentCurrency}</span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {[5, 10, 20, 50, 100].map(amt => (
                      <button
                        key={amt}
                        onClick={() => handleQuickDeposit(amt)}
                        className="flex-1 min-w-[70px] bg-white border border-gray-100 py-4 rounded-2xl font-bold text-blue-600 shadow-sm hover:bg-blue-50 transition-all active:scale-95 whitespace-nowrap flex flex-col items-center gap-1"
                      >
                        <span className="text-xs text-gray-400 font-medium">+{currentCurrency === 'EUR' ? '€' : currentCurrency === 'RSD' ? 'Д' : currentCurrency}</span>
                        <span className="text-lg leading-none">{amt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Status Card */}
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    profile?.isAppLockEnabled ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-400"
                  )}>
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.security}</p>
                    <p className="font-bold text-gray-900 flex items-center gap-2">
                      {t.antiThief}
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                        profile?.isAppLockEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      )}>
                        {profile?.isAppLockEnabled ? "ON" : "OFF"}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowSecurityCenter(true)}
                    className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                    title={t.securityCenter}
                  >
                    <Shield className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={toggleStealthMode}
                    className={cn(
                      "p-2 rounded-xl transition-all",
                      profile?.isStealthMode ? "bg-purple-50 text-purple-600" : "bg-gray-50 text-gray-400 hover:text-purple-600 hover:bg-purple-50"
                    )}
                    title={t.stealthMode}
                  >
                    {profile?.isStealthMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <button 
                    onClick={toggleAppLock}
                    className={cn(
                      "p-2 rounded-xl transition-all",
                      profile?.isAppLockEnabled ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                    )}
                    title={t.appLock}
                  >
                    {profile?.isAppLockEnabled ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Location Status Card */}
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    region ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                  )}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="cursor-pointer" onClick={() => setShowRegionSelector(true)}>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.locationAccess}</p>
                    <p className="font-bold text-gray-900 flex items-center gap-1">
                      {region ? `${t.locationVerified}: ${region.country}` : t.locationDenied}
                      <ArrowRightLeft className="w-3 h-3 text-blue-500" />
                    </p>
                  </div>
                </div>
                <button 
                  onClick={refreshLocation}
                  className="p-2 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                  title={t.refreshLocation}
                >
                  <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
                </button>
              </div>

              {/* Financial Insights Card */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-[2rem] shadow-xl text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Info className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="text-xs font-bold uppercase tracking-widest opacity-80">{t.financialInsights}</h4>
                  </div>
                  <p className="text-sm font-medium leading-relaxed">
                    {financialTip}
                  </p>
                </div>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              </div>

              {/* Quick Transfer Section */}
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  {t.quickTransfer}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">{t.selectCard}</label>
                    <select 
                      value={selectedCardId}
                      onChange={(e) => setSelectedCardId(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">{t.chooseCard}</option>
                      {cards.map(c => (
                        <option key={c.id} value={c.id}>{c.cardName} (**** {c.cardNumber.slice(-4)})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">{t.amount} ({currentCurrency})</label>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-3">
                      {[5, 10, 20, 50, 100, 200, 500].map(amt => (
                        <button
                          key={amt}
                          onClick={() => setTransferAmount(amt.toString())}
                          className={cn(
                            "px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap",
                            transferAmount === amt.toString() 
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                              : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                          )}
                        >
                          {currentCurrency === 'EUR' ? '€' : currentCurrency === 'RSD' ? 'Д' : currentCurrency}{amt}
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                        {currentCurrency === 'EUR' ? '€' : currentCurrency === 'RSD' ? 'Д' : currentCurrency}
                      </div>
                      <input 
                        type="number"
                        placeholder="0.00"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-xl p-4 pl-12 text-lg font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleTransfer('TO_PIGGY')}
                      disabled={!selectedCardId || !transferAmount}
                      className="bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      {t.toPiggy}
                    </button>
                    <button 
                      onClick={() => handleTransfer('FROM_PIGGY')}
                      disabled={!selectedCardId || !transferAmount}
                      className="bg-orange-600 text-white py-4 rounded-2xl font-bold hover:bg-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <ArrowRightLeft className="w-5 h-5" />
                      {t.toCard}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'cards' && (
            <motion.div 
              key="cards"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold">{t.myCards}</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowConnectBank(true)}
                    className="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 transition-all flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4" />
                    {t.connectBank}
                  </button>
                  <button 
                    onClick={() => setShowAddCard(true)}
                    className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {cards.length === 0 && !showAddCard && (
                <div className="bg-white p-12 rounded-[2rem] border border-dashed border-gray-200 text-center">
                  <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">{t.noCards}</p>
                </div>
              )}

              {showAddCard && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-8 rounded-[2rem] shadow-xl border border-blue-100"
                >
                  <form onSubmit={handleAddCard} className="space-y-4">
                    <h4 className="font-bold text-gray-900">{t.addNewCard}</h4>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">{t.selectProvider}</label>
                      <select name="provider" required className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="VISA">Visa</option>
                        <option value="MASTERCARD">MasterCard</option>
                        <option value="MAESTRO">Maestro</option>
                        <option value="PAYPAL">PayPal</option>
                        <option value="WISE">Wise</option>
                      </select>
                    </div>

                    <input name="cardName" placeholder={t.cardholderName} required className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                    <input name="cardNumber" placeholder={t.cardNumber} required className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                    <div className="grid grid-cols-2 gap-4">
                      <input name="expiryDate" placeholder={t.expiryDate} required className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                      <input name="cvv" placeholder={t.cvv} required type="password" maxLength={3} className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all">{t.saveCard}</button>
                      <button type="button" onClick={() => setShowAddCard(false)} className="px-6 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all">{t.cancel}</button>
                    </div>
                  </form>
                </motion.div>
              )}

              {cards.map(card => (
                <div key={card.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-[10px]",
                      card.type === 'BANK' ? (
                        card.provider.includes('CKB GO') ? "bg-yellow-50 text-blue-700" : "bg-gray-100 text-gray-600"
                      ) :
                      card.provider === 'VISA' ? "bg-blue-50 text-blue-600" :
                      card.provider === 'MASTERCARD' ? "bg-orange-50 text-orange-600" :
                      card.provider === 'MAESTRO' ? "bg-red-50 text-red-600" :
                      card.provider === 'PAYPAL' ? "bg-indigo-50 text-indigo-600" :
                      "bg-green-50 text-green-600"
                    )}>
                      {card.type === 'BANK' ? (
                        card.provider.includes('CKB GO') ? <span className="text-xs">CKB</span> : <Globe className="w-6 h-6" />
                      ) : (
                        <>
                          {card.provider === 'VISA' && "VISA"}
                          {card.provider === 'MASTERCARD' && "MC"}
                          {card.provider === 'MAESTRO' && "MS"}
                          {card.provider === 'PAYPAL' && <span className="text-lg">P</span>}
                          {card.provider === 'WISE' && <span className="text-lg">W</span>}
                        </>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{card.cardName}</p>
                      <p className="text-sm text-gray-500 font-mono">
                        {profile?.isStealthMode ? maskedBalance : (card.type === 'CARD' ? `**** **** **** ${card.cardNumber.slice(-4)}` : card.cardNumber)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase">{card.expiryDate}</p>
                    <p className="text-[10px] font-bold text-blue-500 uppercase mt-1">{card.provider}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-600" />
                  {t.recentActivity}
                </h3>
                {(historyTypeFilter !== 'ALL' || historyStartDate || historyEndDate) && (
                  <button 
                    onClick={() => {
                      setHistoryTypeFilter('ALL');
                      setHistoryStartDate('');
                      setHistoryEndDate('');
                    }}
                    className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline"
                  >
                    {t.clearFilters}
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                  <button 
                    onClick={() => setHistoryTypeFilter('ALL')}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                      historyTypeFilter === 'ALL' ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                    )}
                  >
                    {t.all}
                  </button>
                  <button 
                    onClick={() => setHistoryTypeFilter('TO_PIGGY')}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                      historyTypeFilter === 'TO_PIGGY' ? "bg-green-600 text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                    )}
                  >
                    {t.deposits}
                  </button>
                  <button 
                    onClick={() => setHistoryTypeFilter('FROM_PIGGY')}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                      historyTypeFilter === 'FROM_PIGGY' ? "bg-orange-600 text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                    )}
                  >
                    {t.withdrawals}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">{t.startDate}</label>
                    <input 
                      type="date" 
                      value={historyStartDate}
                      onChange={(e) => setHistoryStartDate(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">{t.endDate}</label>
                    <input 
                      type="date" 
                      value={historyEndDate}
                      onChange={(e) => setHistoryEndDate(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {filteredTransactions.length === 0 ? (
                <div className="bg-white p-12 rounded-[2rem] border border-dashed border-gray-200 text-center">
                  <p className="text-gray-500">{t.noTransactions}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTransactions.map(tx => (
                    <div 
                      key={tx.id} 
                      onClick={() => setSelectedTransaction(tx)}
                      className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          tx.type === 'TO_PIGGY' ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                        )}>
                          {tx.type === 'TO_PIGGY' ? <Plus className="w-5 h-5" /> : <ArrowRightLeft className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-sm">
                            {tx.type === 'TO_PIGGY' ? t.deposit : t.withdrawal}
                          </p>
                          <p className="text-xs text-gray-400">
                            {tx.timestamp?.toDate().toLocaleDateString(lang === 'sr' ? 'sr-RS' : 'en-GB')} • {tx.timestamp?.toDate().toLocaleTimeString(lang === 'sr' ? 'sr-RS' : 'en-GB', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <p className={cn(
                        "font-bold",
                        tx.type === 'TO_PIGGY' ? "text-green-600" : "text-orange-600"
                      )}>
                        {tx.type === 'TO_PIGGY' ? '+' : '-'}
                        {profile?.isStealthMode ? maskedBalance : new Intl.NumberFormat(lang === 'sr' ? 'sr-RS' : 'en-GB', {
                          style: 'currency',
                          currency: tx.currency || region?.currency || 'EUR',
                        }).format(tx.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              {/* Language & Currency */}
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">{t.region} & {t.language}</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{t.language}</label>
                    <div className="flex gap-2">
                      {(['en', 'sr'] as const).map((l) => (
                        <button
                          key={l}
                          onClick={() => setLang(l)}
                          className={cn(
                            "flex-1 py-3 rounded-xl text-sm font-bold transition-all border",
                            lang === l ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100" : "bg-white text-gray-500 border-gray-100 hover:bg-gray-50"
                          )}
                        >
                          {l === 'en' ? t.english : t.serbian}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{t.currency}</label>
                    <button
                      onClick={() => setShowRegionSelector(true)}
                      className="w-full bg-gray-50 p-4 rounded-xl flex items-center justify-between hover:bg-gray-100 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <Euro className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-bold text-sm text-gray-900">{currentCurrency}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="w-5 h-5 text-red-600" />
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">{t.security}</h3>
                </div>

                <div className="space-y-3">
                  {/* App Lock / PIN */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <Lock className="w-5 h-5 text-gray-900" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">{t.appLock}</p>
                        <p className="text-[10px] text-gray-400">{profile?.appPin ? t.active : t.inactive}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setPinSetupStep(0);
                          setShowPinSetup(true);
                        }}
                        className="px-4 py-2 bg-white text-blue-600 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-blue-100 hover:bg-blue-50 transition-all"
                      >
                        {profile?.appPin ? t.setNewPin : t.setPin}
                      </button>
                      <button 
                        onClick={toggleAppLock}
                        className={cn(
                          "w-12 h-6 rounded-full relative transition-all",
                          profile?.isAppLockEnabled ? "bg-blue-600" : "bg-gray-200"
                        )}
                      >
                        <motion.div 
                          animate={{ x: profile?.isAppLockEnabled ? 26 : 2 }}
                          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Stealth Mode */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <EyeOff className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">{t.stealthMode}</p>
                        <p className="text-[10px] text-gray-400">{profile?.isStealthMode ? t.active : t.inactive}</p>
                      </div>
                    </div>
                    <button 
                      onClick={toggleStealthMode}
                      className={cn(
                        "w-12 h-6 rounded-full relative transition-all",
                        profile?.isStealthMode ? "bg-purple-600" : "bg-gray-200"
                      )}
                    >
                      <motion.div 
                        animate={{ x: profile?.isStealthMode ? 26 : 2 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </div>

                  {/* Notifications */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <Bell className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">{t.notifications}</p>
                        <p className="text-[10px] text-gray-400">{notificationsEnabled ? t.active : t.inactive}</p>
                      </div>
                    </div>
                    <button 
                      onClick={requestNotificationPermission}
                      className={cn(
                        "w-12 h-6 rounded-full relative transition-all",
                        notificationsEnabled ? "bg-yellow-600" : "bg-gray-200"
                      )}
                    >
                      <motion.div 
                        animate={{ x: notificationsEnabled ? 26 : 2 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* App Info */}
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-3">
                <button 
                  onClick={() => setShowTutorial(true)}
                  className="w-full p-4 bg-gray-50 rounded-2xl flex items-center justify-between hover:bg-gray-100 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <span className="text-xs font-bold text-gray-900">{t.tutorial}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button 
                  onClick={() => setShowAbout(true)}
                  className="w-full p-4 bg-gray-50 rounded-2xl flex items-center justify-between hover:bg-gray-100 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 text-gray-600" />
                    <span className="text-xs font-bold text-gray-900">{t.aboutApp}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Logout */}
              <button 
                onClick={handleLogout}
                className="w-full p-6 bg-red-50 text-red-600 rounded-[2rem] font-bold flex items-center justify-center gap-3 hover:bg-red-100 transition-all"
              >
                <LogOut className="w-5 h-5" />
                {lang === 'sr' ? 'Odjavi se' : 'Logout'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Region Selector Modal */}
        <AnimatePresence>
          {showRegionSelector && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
              >
                <button 
                  onClick={() => setShowRegionSelector(false)}
                  className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                <h3 className="text-2xl font-bold text-gray-900 mb-6">{t.selectRegion}</h3>
                
                <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {EUROPEAN_REGIONS.map((reg) => (
                    <button
                      key={reg.country}
                      onClick={() => handleManualRegion(reg)}
                      className={cn(
                        "p-4 rounded-2xl border text-left transition-all",
                        region?.country === reg.country 
                          ? "border-blue-600 bg-blue-50 text-blue-700" 
                          : "border-gray-100 hover:border-blue-200 hover:bg-gray-50"
                      )}
                    >
                      <p className="font-bold text-sm">{reg.country}</p>
                      <p className="text-[10px] uppercase font-bold opacity-60 tracking-wider">{reg.currency}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Connect Bank Modal */}
        <AnimatePresence>
          {showConnectBank && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
              >
                {connectingBank ? (
                  <div className="py-12 text-center space-y-6">
                    <div className="relative w-24 h-24 mx-auto">
                      <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
                      <motion.div 
                        className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Globe className="w-10 h-10 text-blue-600" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {connectionStep === 0 && t.connectingToBank}
                        {connectionStep === 1 && t.verifyingCredentials}
                        {connectionStep === 2 && t.securingConnection}
                        {connectionStep === 3 && t.bankConnected}
                      </h3>
                      <p className="text-sm text-gray-500">{selectedBank}</p>
                    </div>
                    <div className="flex justify-center gap-1">
                      {[0, 1, 2, 3].map(i => (
                        <div key={i} className={cn(
                          "w-2 h-2 rounded-full transition-all duration-500",
                          connectionStep >= i ? "bg-blue-600 w-6" : "bg-gray-200"
                        )} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        setShowConnectBank(false);
                        setBankSearch('');
                        setSelectedBank(null);
                      }}
                      className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.connectBank}</h3>
                    <p className="text-gray-500 text-sm mb-6">{t.europeanBanks} & {t.globalBanks}</p>

                    <div className="relative mb-6">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="text"
                        placeholder={t.selectBank}
                        value={bankSearch}
                        onChange={(e) => setBankSearch(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 pr-12 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                      {bankSearch && (
                        <button 
                          onClick={() => setBankSearch('')}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                      {bankSearch && searchResults.length > 0 ? (
                        <div>
                          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Search Results</h4>
                          <div className="grid grid-cols-1 gap-2">
                            {searchResults.slice(0, 10).map(bank => (
                              <button
                                key={bank}
                                onClick={() => setSelectedBank(bank)}
                                className={cn(
                                  "p-4 rounded-xl border text-left transition-all flex items-center justify-between",
                                  selectedBank === bank ? "border-blue-600 bg-blue-50" : "border-gray-50 hover:bg-gray-50"
                                )}
                              >
                                <span className="font-bold text-sm">{bank}</span>
                                {selectedBank === bank && <Plus className="w-4 h-4 text-blue-600" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : !bankSearch ? (
                        <>
                          <div>
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{t.europeanBanks}</h4>
                            <div className="grid grid-cols-1 gap-2">
                              {MAJOR_BANKS.EUROPE.map(bank => (
                                <button
                                  key={bank}
                                  onClick={() => setSelectedBank(bank)}
                                  className={cn(
                                    "p-4 rounded-xl border text-left transition-all flex items-center justify-between",
                                    selectedBank === bank ? "border-blue-600 bg-blue-50" : "border-gray-50 hover:bg-gray-50"
                                  )}
                                >
                                  <span className="font-bold text-sm">{bank}</span>
                                  {selectedBank === bank && <Plus className="w-4 h-4 text-blue-600" />}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{t.globalBanks}</h4>
                            <div className="grid grid-cols-1 gap-2">
                              {MAJOR_BANKS.GLOBAL.map(bank => (
                                <button
                                  key={bank}
                                  onClick={() => setSelectedBank(bank)}
                                  className={cn(
                                    "p-4 rounded-xl border text-left transition-all flex items-center justify-between",
                                    selectedBank === bank ? "border-blue-600 bg-blue-50" : "border-gray-50 hover:bg-gray-50"
                                  )}
                                >
                                  <span className="font-bold text-sm">{bank}</span>
                                  {selectedBank === bank && <Plus className="w-4 h-4 text-blue-600" />}
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-400 text-sm italic">No banks found matching "{bankSearch}"</p>
                        </div>
                      )}
                    </div>

                    {selectedBank && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-6 pt-6 border-t border-gray-100"
                      >
                        <div className="mb-4 p-3 bg-blue-50 rounded-xl flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-700">{selectedBank}</span>
                          <button onClick={() => setSelectedBank(null)} className="text-blue-400 hover:text-blue-600">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <form onSubmit={handleAddCard} className="space-y-4">
                          <input type="hidden" name="type" value="BANK" />
                          <input type="hidden" name="provider" value={selectedBank} />
                          
                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">{t.bankAccount}</label>
                            <input name="cardName" placeholder="e.g. My Savings" required className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">{t.iban}</label>
                            <input name="cardNumber" placeholder="ME25..." required className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">{t.swift}</label>
                            <input name="expiryDate" placeholder="CKBM..." required className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>

                          <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all mt-2">
                            {t.connectBank}
                          </button>
                        </form>
                      </motion.div>
                    )}
                  </>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* PIN Setup Modal */}
        <AnimatePresence>
          {showPinSetup && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative"
              >
                <button 
                  onClick={() => {
                    setShowPinSetup(false);
                    setPinSetupStep(0);
                    setNewPin('');
                    setConfirmPin('');
                    setPinError('');
                  }}
                  className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Fingerprint className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {pinSetupStep === 0 ? t.setPin : t.confirmPin}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {pinSetupStep === 0 ? t.antiThief : t.pinMismatch}
                  </p>
                </div>

                <div className="space-y-4">
                  {pinSetupStep === 0 ? (
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">{t.setNewPin}</label>
                      <input 
                        type="password" 
                        maxLength={4} 
                        placeholder="****"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-gray-50 border-none rounded-xl p-4 text-center text-2xl tracking-[1em] font-bold outline-none focus:ring-2 focus:ring-blue-500" 
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">{t.confirmPin}</label>
                      <input 
                        type="password" 
                        maxLength={4} 
                        placeholder="****"
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-gray-50 border-none rounded-xl p-4 text-center text-2xl tracking-[1em] font-bold outline-none focus:ring-2 focus:ring-blue-500" 
                        autoFocus
                      />
                    </div>
                  )}

                  {pinError && <p className="text-red-500 text-xs font-bold text-center">{pinError}</p>}

                  <div className="flex gap-3 mt-2">
                    {pinSetupStep === 1 && (
                      <button 
                        onClick={() => setPinSetupStep(0)}
                        className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                      >
                        {t.previous}
                      </button>
                    )}
                    <button 
                      onClick={handleSetPin}
                      className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all"
                    >
                      {pinSetupStep === 0 ? t.next : t.save}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* About App Modal */}
          {showAbout && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                      <PiggyBank className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{t.aboutApp}</h3>
                  </div>
                  <button onClick={() => setShowAbout(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  <p className="text-gray-600 leading-relaxed">
                    Piggy Bank Go is a premier digital savings application designed for the European market. Our mission is to provide a secure, intuitive, and efficient way for users to manage their savings and connect with their financial institutions across the continent.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-2xl">
                      <ShieldCheck className="w-6 h-6 text-blue-600 mb-2" />
                      <h4 className="font-bold text-sm mb-1">Bank Grade Security</h4>
                      <p className="text-[10px] text-blue-600/70">End-to-end encryption for all your data.</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-2xl">
                      <Globe className="w-6 h-6 text-green-600 mb-2" />
                      <h4 className="font-bold text-sm mb-1">European Reach</h4>
                      <p className="text-[10px] text-green-600/70">Supporting major banks across the EU.</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Version 2.4.0 (Stable)</p>
                    <p className="text-[10px] text-gray-400">© 2026 Piggy Bank Go Europe. All rights reserved.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Tutorial Modal */}
          {showTutorial && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl overflow-hidden relative"
              >
                <button 
                  onClick={() => {
                    setShowTutorial(false);
                    setTutorialStep(0);
                  }} 
                  className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>

                <div className="text-center py-4">
                  <motion.div 
                    key={tutorialStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="w-24 h-24 bg-blue-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
                      {tutorialSteps[tutorialStep].icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{tutorialSteps[tutorialStep].title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {tutorialSteps[tutorialStep].description}
                    </p>
                  </motion.div>
                </div>

                <div className="mt-12 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {tutorialSteps.map((_, i) => (
                      <div 
                        key={i}
                        className={cn(
                          "h-1.5 rounded-full transition-all",
                          tutorialStep === i ? "w-6 bg-blue-600" : "w-1.5 bg-gray-200"
                        )}
                      />
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    {tutorialStep > 0 && (
                      <button 
                        onClick={() => setTutorialStep(prev => prev - 1)}
                        className="p-3 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition-all"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        if (tutorialStep < tutorialSteps.length - 1) {
                          setTutorialStep(prev => prev + 1);
                        } else {
                          setShowTutorial(false);
                          setTutorialStep(0);
                        }
                      }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
                    >
                      {tutorialStep === tutorialSteps.length - 1 ? t.finish : t.next}
                      {tutorialStep < tutorialSteps.length - 1 && <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Security Center Modal */}
          {showSecurityCenter && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{t.securityCenter}</h3>
                      <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">{t.systemSecure}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowSecurityCenter(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-6 rounded-3xl relative overflow-hidden">
                    {isScanning && (
                      <motion.div 
                        initial={{ top: -20 }}
                        animate={{ top: '100%' }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-0.5 bg-blue-500/30 blur-sm z-10"
                      />
                    )}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <Activity className={cn("w-5 h-5", isScanning ? "text-blue-500 animate-pulse" : "text-gray-400")} />
                        <span className="font-bold text-sm">{isScanning ? t.scanning : t.antiHackActive}</span>
                      </div>
                      {!isScanning && (
                        <button 
                          onClick={() => {
                            setIsScanning(true);
                            setTimeout(() => setIsScanning(false), 3000);
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                        >
                          {t.scanNow}
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-6">
                      {/* Anti-Thief Protection Section */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                          <ShieldCheck className="w-4 h-4 text-blue-600" />
                          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.antiThiefProtection}</h4>
                        </div>
                        
                        {[
                          { 
                            label: t.autoLocation, 
                            status: t.automatic, 
                            subStatus: t.active,
                            icon: <MapPin className="w-4 h-4 text-green-500" /> 
                          },
                          { 
                            label: t.encryption, 
                            status: 'AES-256', 
                            subStatus: t.active,
                            icon: <Lock className="w-4 h-4 text-green-500" /> 
                          },
                          { 
                            label: t.firewall, 
                            status: 'V3.1', 
                            subStatus: t.active,
                            icon: <Terminal className="w-4 h-4 text-green-500" /> 
                          },
                          { 
                            label: t.biometrics, 
                            status: t.biometricReady, 
                            subStatus: t.active,
                            icon: <Cpu className="w-4 h-4 text-green-500" /> 
                          },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between bg-white/50 p-3 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                {item.icon}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-gray-900">{item.label}</p>
                                <p className="text-[10px] text-gray-400">{item.status}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                              <span className="text-[10px] font-bold text-green-600 uppercase">{item.subStatus}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* System Integrity */}
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="text-xs font-bold text-gray-700">{t.integrityCheck}</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">100% {t.secure}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-2 border-dashed border-gray-100 rounded-2xl">
                    <h4 className="text-xs font-bold text-gray-900 mb-2">{t.recentSecurityEvents}</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-400">Login from new device</span>
                        <span className="text-gray-400">2h ago</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-400">PIN changed successfully</span>
                        <span className="text-gray-400">1d ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Transaction Details Modal */}
          {selectedTransaction && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-gray-900">{t.transactionDetails}</h3>
                  <button onClick={() => setSelectedTransaction(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="text-center mb-8">
                  <div className={cn(
                    "w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-4",
                    selectedTransaction.type === 'TO_PIGGY' ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                  )}>
                    {selectedTransaction.type === 'TO_PIGGY' ? <Plus className="w-10 h-10" /> : <ArrowRightLeft className="w-10 h-10" />}
                  </div>
                  <h4 className="text-3xl font-bold text-gray-900">
                    {selectedTransaction.type === 'TO_PIGGY' ? '+' : '-'}
                    {profile?.isStealthMode ? maskedBalance : new Intl.NumberFormat(lang === 'sr' ? 'sr-RS' : 'en-GB', {
                      style: 'currency',
                      currency: selectedTransaction.currency || region?.currency || 'EUR',
                    }).format(selectedTransaction.amount)}
                  </h4>
                  <p className="text-sm font-bold text-green-500 uppercase tracking-widest mt-1">{t.completed}</p>
                </div>

                <div className="space-y-4 bg-gray-50 p-6 rounded-3xl">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t.type}</span>
                    <span className="font-bold text-gray-900">{selectedTransaction.type === 'TO_PIGGY' ? t.deposit : t.withdrawal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t.date}</span>
                    <span className="font-bold text-gray-900">{selectedTransaction.timestamp?.toDate().toLocaleDateString(lang === 'sr' ? 'sr-RS' : 'en-GB')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t.time}</span>
                    <span className="font-bold text-gray-900">{selectedTransaction.timestamp?.toDate().toLocaleTimeString(lang === 'sr' ? 'sr-RS' : 'en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t.referenceId}</span>
                    <span className="font-mono text-[10px] font-bold text-gray-900">{selectedTransaction.id.slice(0, 12).toUpperCase()}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedTransaction(null)}
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all mt-8"
                >
                  {t.close}
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Info */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-gray-50/80 backdrop-blur-md">
        <div className="max-w-xl mx-auto flex items-center justify-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <div className="flex items-center gap-1">
            <Globe className="w-3 h-3" />
            {t.region}: {region.country}
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            {t.secureCloudSync}
          </div>
          <div className="flex items-center gap-1">
            <Euro className="w-3 h-3" />
            {t.currency}: {currentCurrency}
          </div>
        </div>
      </footer>
    </div>
  );
}
