const mockMonthlyData = {
    '01': [
        { date: '2025-01-01', category: 'Culture', priority: 'Medium', content: 'New Year celebrations mark beginning of 2025; major cities host grand events with focus on sustainability.' },
        { date: '2025-01-12', category: 'Culture', priority: 'High', content: 'National Youth Day celebrated commemorating birth anniversary of Swami Vivekananda; youth empowerment programs launched.' },
        { date: '2025-01-15', category: 'Defense', priority: 'High', content: 'Army Day parade showcases indigenous defense equipment including Tejas Mk-II and advanced artillery systems.' },
        { date: '2025-01-23', category: 'Polity', priority: 'High', content: 'Netaji Subhas Chandra Bose Jayanti celebrated as Parakram Diwas; government announces new declassified files on freedom struggle.' },
        { date: '2025-01-25', category: 'Polity', priority: 'Medium', content: 'National Voters Day observed with theme "Nothing Like Voting, I Vote for Sure"; focus on first-time voters.' },
        { date: '2025-01-26', category: 'Culture', priority: 'High', content: '76th Republic Day celebrated; Indonesia President as chief guest; parade showcases Nari Shakti and Viksit Bharat theme.' },
        { date: '2025-01-30', category: 'Culture', priority: 'High', content: 'Martyrs Day observed nationwide commemorating Mahatma Gandhi\'s assassination; peace rallies held across country.' },
        { date: '2025-01-31', category: 'Economy', priority: 'High', content: 'Economic Survey 2024-25 tabled predicting 6.5-7% GDP growth; highlights digital economy expansion.' }
    ],

    '02': [
        { date: '2025-02-01', category: 'Economy', priority: 'High', content: 'Union Budget 2025-26 presented emphasizing infrastructure development, healthcare expansion, and middle-class tax relief.' },
        { date: '2025-02-04', category: 'Health', priority: 'High', content: 'World Cancer Day: Government launches enhanced cancer screening program covering 100 districts under Ayushman Bharat.' },
        { date: '2025-02-10', category: 'Health', priority: 'Medium', content: 'National Deworming Day observed with deworming coverage expanded to 25 crore children and adolescents nationwide.' },
        { date: '2025-02-12', category: 'Economy', priority: 'Medium', content: 'National Productivity Day celebrated; India reports 15% improvement in manufacturing productivity index.' },
        { date: '2025-02-13', category: 'Culture', priority: 'High', content: 'Sarojini Naidu birth anniversary celebrated as National Women\'s Day; women entrepreneurship scheme expanded.' },
        { date: '2025-02-20', category: 'Rights', priority: 'Medium', content: 'World Day of Social Justice: Supreme Court delivers landmark judgment on workplace equality and discrimination.' },
        { date: '2025-02-24', category: 'Economy', priority: 'High', content: 'Central Excise Day celebrated; GST collections cross Rs 1.9 lakh crore reflecting economic resilience.' },
        { date: '2025-02-28', category: 'Science', priority: 'High', content: 'National Science Day commemorates CV Raman\'s discovery of Raman Effect; science congress inaugurated in Bangalore.' }
    ],

    '03': [
        { date: '2025-03-03', category: 'Environment', priority: 'High', content: 'World Wildlife Day: India showcases Project Tiger success with tiger population crossing 3,900 mark.' },
        { date: '2025-03-04', category: 'Safety', priority: 'Medium', content: 'National Safety Day observed with focus on industrial safety; new workplace safety regulations announced.' },
        { date: '2025-03-08', category: 'Culture', priority: 'High', content: 'International Women\'s Day: Government launches women-led development scheme with Rs 50,000 crore allocation.' },
        { date: '2025-03-15', category: 'Rights', priority: 'High', content: 'World Consumer Rights Day: New consumer protection guidelines for e-commerce and digital payments announced.' },
        { date: '2025-03-20', category: 'Health', priority: 'Medium', content: 'International Day of Happiness: National mental health awareness campaign launched covering 500 districts.' },
        { date: '2025-03-21', category: 'Environment', priority: 'High', content: 'International Day of Forests: India announces target to plant 1 billion trees under Green India Mission by 2030.' },
        { date: '2025-03-22', category: 'Environment', priority: 'High', content: 'World Water Day: Jal Jeevan Mission achieves 90% tap water coverage; 18 crore rural households connected.' },
        { date: '2025-03-23', category: 'Culture', priority: 'High', content: 'Shaheed Diwas: Nation pays tribute to Bhagat Singh, Rajguru, and Sukhdev; patriotic events held nationwide.' },
        { date: '2025-03-24', category: 'Health', priority: 'High', content: 'World Tuberculosis Day: India reports 18% decline in TB cases; elimination target by 2025 on track.' }
    ],

    '04': [
        { date: '2025-04-01', category: 'Economy', priority: 'High', content: 'New financial year FY 2025-26 begins; GST Council announces rationalization of tax slabs for MSMEs.' },
        { date: '2025-04-05', category: 'Maritime', priority: 'High', content: 'National Maritime Day celebrates India\'s maritime heritage; India ranks among top 20 maritime nations globally.' },
        { date: '2025-04-07', category: 'Health', priority: 'High', content: 'World Health Day: India launches universal health coverage expansion reaching additional 10 crore beneficiaries.' },
        { date: '2025-04-14', category: 'Culture', priority: 'High', content: 'Ambedkar Jayanti celebrated nationwide; Constitution Museum inaugurated; social justice schemes expanded.' },
        { date: '2025-04-17', category: 'Health', priority: 'Medium', content: 'World Hemophilia Day: Awareness campaign on bleeding disorders launched; free treatment centers expanded to 150 cities.' },
        { date: '2025-04-18', category: 'Heritage', priority: 'High', content: 'World Heritage Day: ASI showcases digital restoration of 50 historical monuments using AI technology.' },
        { date: '2025-04-21', category: 'Polity', priority: 'Medium', content: 'Civil Services Day: Awards given to outstanding civil servants; 100 officers honored for exemplary work.' },
        { date: '2025-04-22', category: 'Environment', priority: 'High', content: 'Earth Day: India reaffirms commitment to 500 GW renewable energy capacity target by 2030.' },
        { date: '2025-04-25', category: 'Health', priority: 'High', content: 'World Malaria Day: India reports 80% reduction in malaria cases; elimination target in sight.' }
    ],

    '05': [
        { date: '2025-05-01', category: 'Labor', priority: 'High', content: 'International Labour Day: New labor codes implementation discussed; focus on gig workers\' rights and social security.' },
        { date: '2025-05-03', category: 'Media', priority: 'High', content: 'World Press Freedom Day: India ranks 159th in World Press Freedom Index; concerns over media independence raised.' },
        { date: '2025-05-08', category: 'Health', priority: 'High', content: 'World Red Cross Day: Blood donation camps organized across 5,000 locations; 2 lakh units collected.' },
        { date: '2025-05-11', category: 'Technology', priority: 'High', content: 'National Technology Day celebrates Pokhran nuclear tests; India\'s achievements in space and defense tech showcased.' },
        { date: '2025-05-12', category: 'Health', priority: 'High', content: 'International Nurses Day: 30 lakh healthcare workers honored; nursing education infrastructure expansion announced.' },
        { date: '2025-05-15', category: 'Culture', priority: 'High', content: 'International Day of Families: Social welfare schemes for families highlighted; childcare support expanded.' },
        { date: '2025-05-21', category: 'Security', priority: 'High', content: 'National Anti-Terrorism Day observed in memory of Rajiv Gandhi; counter-terrorism measures reviewed.' },
        { date: '2025-05-22', category: 'Environment', priority: 'High', content: 'International Day for Biological Diversity: India reports 8% of world\'s biodiversity; 106 national parks maintained.' },
        { date: '2025-05-31', category: 'Health', priority: 'High', content: 'World No-Tobacco Day: Anti-smoking campaign intensified; tobacco taxes increased by 12% in Union Budget.' }
    ],

    '06': [
        { date: '2025-06-01', category: 'Agriculture', priority: 'Medium', content: 'World Milk Day: India retains position as world\'s largest milk producer with 230 million tons annual production.' },
        { date: '2025-06-05', category: 'Environment', priority: 'High', content: 'World Environment Day: India hosts global event on plastic pollution; ban on single-use plastics extended.' },
        { date: '2025-06-08', category: 'Environment', priority: 'High', content: 'World Oceans Day: Coastal cleanup drives organized; 15,000 tons of marine waste collected from Indian coastline.' },
        { date: '2025-06-12', category: 'Rights', priority: 'High', content: 'World Day Against Child Labour: Stricter enforcement announced; child labor reduced by 65% since 2001.' },
        { date: '2025-06-14', category: 'Health', priority: 'High', content: 'World Blood Donor Day: Record 1.2 crore blood donations recorded across India; 100% voluntary donations achieved.' },
        { date: '2025-06-15', category: 'Rights', priority: 'High', content: 'World Elder Abuse Awareness Day: Senior citizen welfare schemes expanded; helpline extended to 500 cities.' },
        { date: '2025-06-20', category: 'International', priority: 'High', content: 'World Refugee Day: India reiterates support for refugee welfare; hosts 2.5 lakh refugees from neighboring countries.' },
        { date: '2025-06-21', category: 'Culture', priority: 'High', content: 'International Yoga Day: Mass yoga events held globally with 50 million participants; PM leads celebration in Delhi.' },
        { date: '2025-06-26', category: 'Health', priority: 'High', content: 'International Day Against Drug Abuse: National anti-narcotics campaign launched; 100 de-addiction centers opened.' }
    ],

    '07': [
        { date: '2025-07-01', category: 'Taxation', priority: 'High', content: 'GST Day: Goods and Services Tax completes 8 years; cumulative revenue collection crosses Rs 150 lakh crore.' },
        { date: '2025-07-06', category: 'Health', priority: 'Medium', content: 'World Zoonoses Day: Awareness on animal-to-human disease transmission; surveillance system strengthened.' },
        { date: '2025-07-11', category: 'Demographics', priority: 'High', content: 'World Population Day: India\'s demographic dividend highlighted; youth population at 65% of total population.' },
        { date: '2025-07-18', category: 'International', priority: 'High', content: 'Nelson Mandela International Day: India pays tribute to anti-apartheid icon; UN peacekeeping contribution highlighted.' },
        { date: '2025-07-23', category: 'Media', priority: 'High', content: 'National Broadcasting Day marks first radio broadcast in India (1927); All India Radio completes 98 years.' },
        { date: '2025-07-26', category: 'Defense', priority: 'High', content: 'Kargil Vijay Diwas: Nation commemorates 26th anniversary of Kargil War victory; tributes paid to martyrs.' },
        { date: '2025-07-27', category: 'Defense', priority: 'Medium', content: 'Armed Forces Flag Day: Fundraising campaign for welfare of ex-servicemen and war widows; Rs 500 crore collected.' },
        { date: '2025-07-28', category: 'Health', priority: 'High', content: 'World Hepatitis Day: India strengthens hepatitis elimination program; free testing camps at 10,000 centers.' },
        { date: '2025-07-29', category: 'Environment', priority: 'High', content: 'International Tiger Day: India\'s tiger population shows 6% annual growth; 53 tiger reserves maintained.' }
    ],

    '08': [
        { date: '2025-08-06', category: 'International', priority: 'High', content: 'Hiroshima Day: India observes nuclear disarmament remembrance; calls for global nuclear weapons ban.' },
        { date: '2025-08-08', category: 'History', priority: 'High', content: 'Quit India Movement anniversary: Nation remembers freedom struggle (1942); patriotic programs organized.' },
        { date: '2025-08-09', category: 'Rights', priority: 'High', content: 'International Day of Indigenous People: Tribal welfare schemes highlighted; Rs 25,000 crore allocated for tribal development.' },
        { date: '2025-08-12', category: 'Youth', priority: 'High', content: 'International Youth Day: National youth policy achievements showcased; skill development programs reach 2 crore youth.' },
        { date: '2025-08-15', category: 'National', priority: 'High', content: '79th Independence Day celebrated; PM Modi announces new initiatives for Viksit Bharat 2047 from Red Fort.' },
        { date: '2025-08-19', category: 'Culture', priority: 'Medium', content: 'World Photography Day: Indian photographers recognized globally; national photography awards distributed.' },
        { date: '2025-08-20', category: 'Polity', priority: 'High', content: 'Sadbhavana Diwas: Birth anniversary of former PM Rajiv Gandhi observed; communal harmony programs held.' },
        { date: '2025-08-23', category: 'Rights', priority: 'High', content: 'International Day for Remembrance of Slave Trade: Human rights and dignity emphasized at national events.' },
        { date: '2025-08-29', category: 'Sports', priority: 'High', content: 'National Sports Day: Birth anniversary of hockey legend Major Dhyan Chand; Khelo India initiatives expanded.' }
    ],

    '09': [
        { date: '2025-09-02', category: 'Agriculture', priority: 'Medium', content: 'World Coconut Day: India celebrates position as third-largest coconut producer; exports reach Rs 5,000 crore.' },
        { date: '2025-09-05', category: 'Education', priority: 'High', content: 'Teachers Day: Birth anniversary of Dr. Sarvepalli Radhakrishnan; 95 lakh teachers honored across India.' },
        { date: '2025-09-08', category: 'Education', priority: 'High', content: 'International Literacy Day: Digital literacy campaign expanded; 85% adult literacy rate achieved nationwide.' },
        { date: '2025-09-14', category: 'Culture', priority: 'High', content: 'Hindi Diwas celebrated to promote Hindi language; Hindi teaching mandatory in 18 states and UTs.' },
        { date: '2025-09-15', category: 'Democracy', priority: 'High', content: 'International Day of Democracy: Electoral reforms discussed; India\'s democratic processes lauded globally.' },
        { date: '2025-09-16', category: 'Environment', priority: 'High', content: 'World Ozone Day: India reports 100% compliance in phasing out ozone-depleting substances under Montreal Protocol.' },
        { date: '2025-09-21', category: 'International', priority: 'High', content: 'International Day of Peace: India emphasizes dialogue and diplomacy; peacekeeping contributions highlighted.' },
        { date: '2025-09-23', category: 'Language', priority: 'High', content: 'International Day of Sign Languages: Sign language recognition expanded; included in education curriculum.' },
        { date: '2025-09-27', category: 'Tourism', priority: 'High', content: 'World Tourism Day: India receives 95 lakh foreign tourists; tourism sector contributes 6.8% to GDP.' }
    ],

    '10': [
        { date: '2025-10-01', category: 'Culture', priority: 'High', content: 'International Day of Older Persons: Senior citizen welfare schemes expanded; monthly pension increased to Rs 2,000.' },
        { date: '2025-10-02', category: 'National', priority: 'High', content: 'Gandhi Jayanti and International Day of Non-Violence; nationwide cleanliness drives under Swachh Bharat Mission.' },
        { date: '2025-10-05', category: 'Education', priority: 'High', content: 'World Teachers Day: NEP 2020 implementation reaches 75% completion; digital classrooms expanded.' },
        { date: '2025-10-08', category: 'Defense', priority: 'High', content: 'Indian Air Force Day: 93rd anniversary celebrated; Tejas Mk-II fighter jets showcased in aerial display.' },
        { date: '2025-10-10', category: 'Health', priority: 'High', content: 'World Mental Health Day: National mental health program expanded; tele-counseling services launched nationwide.' },
        { date: '2025-10-11', category: 'Rights', priority: 'High', content: 'International Day of Girl Child: Beti Bachao Beti Padhao scheme strengthens; sex ratio improves to 943.' },
        { date: '2025-10-15', category: 'Culture', priority: 'High', content: 'Birth anniversary of Dr. APJ Abdul Kalam celebrated as World Students Day; youth innovation awards distributed.' },
        { date: '2025-10-16', category: 'Food', priority: 'High', content: 'World Food Day: India achieves record foodgrain production of 330 million tons; food security strengthened.' },
        { date: '2025-10-24', category: 'International', priority: 'High', content: 'United Nations Day: India\'s contributions to UN peacekeeping and sustainable development highlighted.' },
        { date: '2025-10-31', category: 'National', priority: 'High', content: 'National Unity Day: Birth anniversary of Sardar Vallabhbhai Patel; Run for Unity organized across nation.' }
    ],

    '11': [
        { date: '2025-11-07', category: 'Health', priority: 'Medium', content: 'National Cancer Awareness Day: Early detection campaigns launched; cancer screening centers expanded to 500 districts.' },
        { date: '2025-11-09', category: 'Polity', priority: 'High', content: 'Legal Services Day: Free legal aid camps organized; 5 lakh cases resolved through Lok Adalats nationwide.' },
        { date: '2025-11-11', category: 'Education', priority: 'High', content: 'National Education Day: Birth anniversary of Maulana Abul Kalam Azad; education reforms celebrated.' },
        { date: '2025-11-14', category: 'Culture', priority: 'High', content: 'Children\'s Day: Birth anniversary of Jawaharlal Nehru; child welfare schemes reviewed and expanded.' },
        { date: '2025-11-17', category: 'International', priority: 'Medium', content: 'International Students Day: India hosts 5.5 lakh international students from 180 countries.' },
        { date: '2025-11-19', category: 'Rights', priority: 'High', content: 'International Men\'s Day: Focus on men\'s health and gender equality; mental health programs launched.' },
        { date: '2025-11-20', category: 'Rights', priority: 'High', content: 'Universal Children\'s Day: UNICEF-India partnership launches child nutrition program covering 10 crore children.' },
        { date: '2025-11-21', category: 'Media', priority: 'High', content: 'World Television Day: India\'s broadcasting sector growth highlighted; 900 TV channels operational.' },
        { date: '2025-11-26', category: 'National', priority: 'High', content: 'Constitution Day (Samvidhan Diwas): 75 years of Constitution celebrated; Fundamental Duties awareness campaign.' }
    ],

    '12': [
    { date: '2025-12-01', category: 'International Day', priority: 'High', content: 'World AIDS Day observed globally to raise awareness about HIV/AIDS.' },
    { date: '2025-12-04', category: 'National Day', priority: 'High', content: 'Indian Navy Day celebrated to commemorate Operation Trident (1971).' },
    { date: '2025-12-06', category: 'National Day', priority: 'High', content: 'Mahaparinirvan Diwas observed in memory of Dr. B. R. Ambedkar.' },
    { date: '2025-12-10', category: 'International Day', priority: 'High', content: 'Human Rights Day observed worldwide.' },
    { date: '2025-12-16', category: 'National Day', priority: 'High', content: 'Vijay Diwas commemorates India\'s victory in the 1971 war.' },
    { date: '2025-12-25', category: 'National Day', priority: 'High', content: 'Good Governance Day observed on birth anniversary of Atal Bihari Vajpayee.' },
    { date: '2025-12-26', category: 'National Day', priority: 'High', content: 'Veer Bal Diwas observed in India.' }
]
};

module.exports = {mockMonthlyData};
