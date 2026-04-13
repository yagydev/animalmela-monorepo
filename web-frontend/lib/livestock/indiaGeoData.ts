/** India states/UTs and key districts for livestock marketplace geo filtering. */

export const INDIA_STATES: string[] = [
  'Andaman & Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra & Nagar Haveli',
  'Daman & Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu & Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export const DISTRICTS_BY_STATE: Record<string, string[]> = {
  'Andhra Pradesh': [
    'Guntur', 'Krishna', 'Kurnool', 'Nellore', 'Prakasam',
    'Srikakulam', 'Visakhapatnam', 'Vizianagaram', 'West Godavari',
    'East Godavari', 'Chittoor', 'Kadapa', 'Anantapur'
  ],
  'Arunachal Pradesh': ['Itanagar', 'Tawang', 'East Siang', 'West Siang'],
  'Assam': [
    'Kamrup', 'Dibrugarh', 'Jorhat', 'Goalpara', 'Cachar',
    'Nagaon', 'Darrang', 'Sonitpur', 'Tinsukia'
  ],
  'Bihar': [
    'Patna', 'Muzaffarpur', 'Gaya', 'Bhagalpur', 'Darbhanga',
    'Vaishali', 'Sitamarhi', 'Samastipur', 'East Champaran',
    'West Champaran', 'Saran', 'Nalanda', 'Rohtas'
  ],
  'Chhattisgarh': [
    'Raipur', 'Bilaspur', 'Durg', 'Rajnandgaon', 'Korba',
    'Jagdalpur', 'Raigarh', 'Ambikapur'
  ],
  'Delhi': ['Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'South Delhi', 'West Delhi'],
  'Goa': ['North Goa', 'South Goa'],
  'Gujarat': [
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Junagadh',
    'Amreli', 'Anand', 'Banaskantha', 'Bharuch', 'Bhavnagar',
    'Gandhinagar', 'Kutch', 'Mehsana', 'Patan', 'Porbandar',
    'Sabarkantha', 'Surendranagar'
  ],
  'Haryana': [
    'Ambala', 'Hisar', 'Karnal', 'Rohtak', 'Sonipat',
    'Sirsa', 'Fatehabad', 'Jind', 'Kaithal', 'Kurukshetra',
    'Panipat', 'Bhiwani', 'Mahendragarh', 'Rewari', 'Faridabad', 'Gurugram'
  ],
  'Himachal Pradesh': [
    'Shimla', 'Kangra', 'Mandi', 'Solan', 'Una', 'Hamirpur',
    'Chamba', 'Bilaspur', 'Kullu', 'Kinnaur'
  ],
  'Jharkhand': [
    'Ranchi', 'Dhanbad', 'Bokaro', 'Jamshedpur', 'Hazaribagh',
    'Giridih', 'Deoghar', 'Dumka', 'Palamu'
  ],
  'Karnataka': [
    'Bengaluru Urban', 'Mysuru', 'Tumkur', 'Belagavi', 'Dharwad',
    'Davangere', 'Ballari', 'Bidar', 'Kalaburagi', 'Haveri',
    'Hassan', 'Kodagu', 'Mandya', 'Raichur', 'Shivamogga',
    'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir'
  ],
  'Kerala': [
    'Thiruvananthapuram', 'Ernakulam', 'Thrissur', 'Kozhikode',
    'Palakkad', 'Malappuram', 'Kollam', 'Kannur',
    'Alappuzha', 'Kottayam', 'Idukki', 'Kasaragod', 'Pathanamthitta', 'Wayanad'
  ],
  'Madhya Pradesh': [
    'Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain',
    'Sagar', 'Rewa', 'Satna', 'Chhindwara', 'Morena',
    'Dewas', 'Dhar', 'Hoshangabad', 'Khandwa', 'Mandsaur',
    'Neemuch', 'Raisen', 'Rajgarh', 'Shajapur', 'Vidisha'
  ],
  'Maharashtra': [
    'Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad',
    'Solapur', 'Kolhapur', 'Amravati', 'Satara', 'Sangli',
    'Ahmednagar', 'Dhule', 'Jalgaon', 'Jalna', 'Latur',
    'Nanded', 'Osmanabad', 'Parbhani', 'Raigad', 'Thane'
  ],
  'Manipur': ['Imphal East', 'Imphal West', 'Thoubal', 'Bishnupur', 'Churachandpur'],
  'Meghalaya': ['East Khasi Hills', 'West Khasi Hills', 'Ri Bhoi', 'East Jaintia Hills', 'West Garo Hills'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Champhai', 'Kolasib'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha'],
  'Odisha': [
    'Khordha', 'Cuttack', 'Ganjam', 'Sundargarh', 'Balasore',
    'Mayurbhanj', 'Koraput', 'Sambalpur', 'Rayagada', 'Keonjhar',
    'Bargarh', 'Bolangir', 'Dhenkanal', 'Kalahandi', 'Puri'
  ],
  'Punjab': [
    'Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala', 'Bathinda',
    'Gurdaspur', 'Firozpur', 'Hoshiarpur', 'Kapurthala', 'Moga',
    'Mohali', 'Muktsar', 'Rupnagar', 'Sangrur', 'Fazilka', 'Faridkot'
  ],
  'Rajasthan': [
    'Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer',
    'Bikaner', 'Alwar', 'Bharatpur', 'Chittorgarh', 'Dausa',
    'Hanumangarh', 'Nagaur', 'Pali', 'Sikar', 'Tonk', 'Barmer', 'Jaisalmer'
  ],
  'Sikkim': ['East Sikkim', 'West Sikkim', 'North Sikkim', 'South Sikkim'],
  'Tamil Nadu': [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem',
    'Erode', 'Tirunelveli', 'Tirupur', 'Vellore', 'Dindigul',
    'Kancheepuram', 'Krishnagiri', 'Namakkal', 'Nilgiris', 'Pudukkottai',
    'Ramanathapuram', 'Sivaganga', 'Thanjavur', 'Theni', 'Tiruvallur', 'Tuticorin'
  ],
  'Telangana': [
    'Hyderabad', 'Karimnagar', 'Warangal', 'Nalgonda', 'Khammam',
    'Nizamabad', 'Mahbubnagar', 'Medak', 'Rangareddy', 'Adilabad',
    'Jagtial', 'Jogulamba Gadwal', 'Kamareddy', 'Mancherial', 'Medchal', 'Suryapet'
  ],
  'Tripura': ['West Tripura', 'Sepahijala', 'Gomati', 'South Tripura', 'North Tripura'],
  'Uttar Pradesh': [
    'Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut',
    'Allahabad', 'Bareilly', 'Aligarh', 'Moradabad', 'Saharanpur',
    'Mathura', 'Muzaffarnagar', 'Gorakhpur', 'Jhansi', 'Shahjahanpur',
    'Rampur', 'Bulandshahr', 'Etah', 'Farrukhabad', 'Fatehpur',
    'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur',
    'Hardoi', 'Hathras', 'Jaunpur', 'Lakhimpur Kheri', 'Mainpuri'
  ],
  'Uttarakhand': [
    'Dehradun', 'Haridwar', 'Nainital', 'Udham Singh Nagar',
    'Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Pauri Garhwal',
    'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal', 'Uttarkashi'
  ],
  'West Bengal': [
    'Kolkata', 'North 24 Parganas', 'South 24 Parganas', 'Howrah',
    'Hooghly', 'Bardhaman', 'Murshidabad', 'Nadia', 'Birbhum',
    'Bankura', 'Purulia', 'Jalpaiguri', 'Darjeeling', 'Cooch Behar',
    'Malda', 'Dinajpur', 'Medinipur East', 'Medinipur West'
  ],
  'Andaman & Nicobar Islands': ['South Andaman', 'North & Middle Andaman', 'Nicobar'],
  'Chandigarh': ['Chandigarh'],
  'Dadra & Nagar Haveli': ['Dadra & Nagar Haveli'],
  'Daman & Diu': ['Daman', 'Diu'],
  'Jammu & Kashmir': [
    'Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Budgam',
    'Doda', 'Ganderbal', 'Kathua', 'Kulgam', 'Kupwara',
    'Poonch', 'Pulwama', 'Rajouri', 'Ramban', 'Reasi', 'Shopian', 'Udhampur'
  ],
  'Ladakh': ['Leh', 'Kargil'],
  'Lakshadweep': ['Lakshadweep'],
  'Puducherry': ['Pondicherry', 'Karaikal', 'Mahe', 'Yanam'],
};
