const mockYearlyData = {
    // Replace the '2025' section in mockYearlyData.js with exam-focused static GK

    '2025': [
        // ===== POLITY & CONSTITUTION (Essential for ALL exams) =====
        { date: '2025-01-26', category: 'Constitution', priority: 'High', content: 'Indian Constitution came into force on January 26, 1950; has 448 articles in 25 parts and 12 schedules (originally 395 articles, 22 parts, 8 schedules).' },
        { date: '2025-01-26', category: 'Polity', priority: 'High', content: 'Dr. B.R. Ambedkar is Chairman of Drafting Committee; Constitution took 2 years, 11 months, 18 days to draft with 165 sittings.' },
        { date: '2025-02-15', category: 'Polity', priority: 'High', content: 'Fundamental Rights under Part III (Articles 12-35): Right to Equality, Freedom, Against Exploitation, to Freedom of Religion, Cultural & Educational Rights, Constitutional Remedies.' },
        { date: '2025-02-20', category: 'Constitution', priority: 'High', content: 'Directive Principles of State Policy under Part IV (Articles 36-51); borrowed from Irish Constitution; not justiciable in court.' },
        { date: '2025-03-10', category: 'Polity', priority: 'High', content: 'President of India elected by Electoral College consisting of elected members of Parliament and State Legislatures; term of 5 years.' },
        { date: '2025-03-15', category: 'Polity', priority: 'High', content: 'Supreme Court of India established on January 26, 1950; has 34 judges including Chief Justice; retirement age 65 years.' },
        { date: '2025-04-05', category: 'Constitution', priority: 'High', content: 'Article 356 deals with President\'s Rule in states; Article 360 deals with Financial Emergency; Article 352 deals with National Emergency.' },
        
        // ===== HISTORY (Freedom Struggle & Important Events) =====
        { date: '2025-04-13', category: 'History', priority: 'High', content: 'Jallianwala Bagh massacre occurred on April 13, 1919 in Amritsar; General Dyer ordered firing killing hundreds of unarmed civilians.' },
        { date: '2025-05-10', category: 'History', priority: 'High', content: 'First War of Independence (Sepoy Mutiny) began on May 10, 1857 at Meerut; Mangal Pandey was first martyr of revolt.' },
        { date: '2025-06-23', category: 'History', priority: 'High', content: 'Battle of Plassey fought on June 23, 1757 between British East India Company and Siraj-ud-Daulah; marked beginning of British rule.' },
        { date: '2025-08-08', category: 'History', priority: 'High', content: 'Quit India Movement launched on August 8, 1942 by Mahatma Gandhi with slogan "Do or Die" at Gowalia Tank (August Kranti Maidan), Mumbai.' },
        { date: '2025-08-15', category: 'National', priority: 'High', content: 'India gained independence on August 15, 1947; first Prime Minister Jawaharlal Nehru hoisted national flag at Red Fort, Delhi.' },
        { date: '2025-12-28', category: 'History', priority: 'High', content: 'Indian National Congress founded on December 28, 1885 in Bombay by Allan Octavian Hume; first session presided by W.C. Bonnerjee.' },
        
        // ===== GEOGRAPHY (Physical & Indian Geography) =====
        { date: '2025-03-22', category: 'Geography', priority: 'High', content: 'Ganga is longest river in India (2525 km); originates from Gangotri Glacier (Uttarakhand); flows through 5 states into Bay of Bengal.' },
        { date: '2025-05-25', category: 'Geography', priority: 'High', content: 'India shares land borders with 7 countries: Pakistan, Afghanistan, China, Nepal, Bhutan, Myanmar, Bangladesh; maritime borders with Sri Lanka, Maldives, Indonesia.' },
        { date: '2025-06-10', category: 'Geography', priority: 'High', content: 'Standard Meridian of India: 82°30\'E passes through Mirzapur (UP); Indian Standard Time is UTC+5:30, ahead of GMT by 5 hours 30 minutes.' },
        { date: '2025-07-18', category: 'Geography', priority: 'High', content: 'Western Ghats run parallel to western coast covering 6 states; UNESCO World Heritage Site (2012); biodiversity hotspot with 325+ threatened species.' },
        { date: '2025-09-12', category: 'Geography', priority: 'High', content: 'Tropic of Cancer (23°30\'N) passes through 8 Indian states: Gujarat, Rajasthan, MP, Chhattisgarh, Jharkhand, West Bengal, Tripura, Mizoram.' },
        
        // ===== ECONOMICS (Important Terms & Institutions) =====
        { date: '2025-04-01', category: 'Economics', priority: 'High', content: 'Reserve Bank of India established on April 1, 1935; nationalized in 1949; headquarters in Mumbai; regulates monetary policy and currency.' },
        { date: '2025-07-01', category: 'Economics', priority: 'High', content: 'GST (Goods and Services Tax) implemented from July 1, 2017; replaced 17 indirect taxes; four tax slabs: 5%, 12%, 18%, 28%.' },
        { date: '2025-08-20', category: 'Economics', priority: 'High', content: 'NITI Aayog replaced Planning Commission in 2015; serves as policy think tank; CEO is ex-officio Secretary; headed by Prime Minister.' },
        { date: '2025-10-15', category: 'Economics', priority: 'High', content: 'SEBI (Securities Exchange Board of India) established in 1992 under SEBI Act; regulates stock exchanges and protects investor interests; headquarters in Mumbai.' },
        
        // ===== SCIENCE & TECHNOLOGY (Space & Achievements) =====
        { date: '2025-04-19', category: 'Space', priority: 'High', content: 'Aryabhata was India\'s first satellite launched on April 19, 1975 by Soviet Union from Kapustin Yar; named after mathematician Aryabhata.' },
        { date: '2025-08-23', category: 'Science', priority: 'High', content: 'Chandrayaan-3 successfully landed on Moon\'s South Pole on August 23, 2023; India became 4th country to achieve lunar soft landing after USA, USSR, China.' },
        { date: '2025-09-24', category: 'Space', priority: 'High', content: 'Mars Orbiter Mission (Mangalyaan) launched in November 2013; reached Mars orbit on September 24, 2014; India first Asian nation to reach Mars in first attempt.' },
        { date: '2025-11-05', category: 'Science', priority: 'High', content: 'C.V. Raman discovered Raman Effect on February 28, 1928; won Nobel Prize in Physics in 1930; National Science Day celebrated on February 28.' },
        
        // ===== SPORTS & AWARDS =====
        { date: '2025-08-29', category: 'Sports', priority: 'High', content: 'Major Dhyan Chand known as Hockey Wizard; won 3 Olympic gold medals (1928, 1932, 1936); National Sports Day celebrated on his birth anniversary August 29.' },
        { date: '2025-08-07', category: 'Sports', priority: 'High', content: 'Neeraj Chopra won India\'s first Olympic gold in athletics (Javelin) at Tokyo 2020 on August 7, 2021; also won World Championship gold in 2023.' },
        { date: '2025-11-22', category: 'Awards', priority: 'High', content: 'Bharat Ratna is highest civilian award instituted in 1954; limited to maximum 3 recipients per year; no monetary grant; can be awarded posthumously.' },
        { date: '2025-12-10', category: 'Awards', priority: 'High', content: 'Nobel Prize awarded annually since 1901 in Physics, Chemistry, Medicine, Literature, Peace, Economics; presented on December 10 (Alfred Nobel\'s death anniversary).' },
        
        // ===== DEFENSE & MILITARY =====
        { date: '2025-01-15', category: 'Defense', priority: 'High', content: 'Indian Army Day celebrated on January 15; commemorates Field Marshal K.M. Cariappa becoming first Indian Commander-in-Chief in 1949.' },
        { date: '2025-04-08', category: 'Defense', priority: 'High', content: 'Indian Air Force Day celebrated on October 8; established in 1932 as Royal Indian Air Force; "Royal" prefix dropped in 1950.' },
        { date: '2025-09-02', category: 'Defense', priority: 'High', content: 'INS Vikrant commissioned in September 2022; India\'s first indigenous aircraft carrier; built at Cochin Shipyard; displaces 45,000 tons.' },
        { date: '2025-12-04', category: 'Defense', priority: 'High', content: 'Indian Navy Day celebrated on December 4; commemorates Operation Trident during 1971 Indo-Pak war when Indian Navy attacked Karachi harbor.' },
        
        // ===== CULTURE & HERITAGE =====
        { date: '2025-06-21', category: 'Culture', priority: 'High', content: 'International Yoga Day celebrated on June 21 since 2015; proposed by PM Modi at UN General Assembly in 2014; recognized by 193 member nations.' },
        { date: '2025-10-02', category: 'National', priority: 'High', content: 'Gandhi Jayanti celebrated on October 2; Mahatma Gandhi born in 1869 at Porbandar, Gujarat; also celebrated as International Day of Non-Violence.' },
        { date: '2025-11-14', category: 'Culture', priority: 'High', content: 'Children\'s Day celebrated on November 14; birth anniversary of Jawaharlal Nehru who loved children and was called "Chacha Nehru".' },
        { date: '2025-12-06', category: 'History', priority: 'High', content: 'Mahaparinirvan Diwas observed on December 6; Dr. B.R. Ambedkar passed away in 1956; conferred Bharat Ratna posthumously in 1990.' },
        
        // ===== ENVIRONMENT & WILDLIFE =====
        { date: '2025-07-29', category: 'Environment', priority: 'High', content: 'Project Tiger launched in 1973 with 9 tiger reserves; currently 53 tiger reserves; tiger population increased from 1,411 (2006) to 3,682 (2022).' },
        { date: '2025-10-12', category: 'Environment', priority: 'High', content: 'Kaziranga National Park in Assam is home to two-thirds of world\'s one-horned rhinoceros; UNESCO World Heritage Site since 1985.' },
        
        // ===== LITERATURE & AUTHORS =====
        { date: '2025-05-07', category: 'Literature', priority: 'High', content: 'Rabindranath Tagore won Nobel Prize in Literature in 1913 for Gitanjali; first non-European Nobel laureate in Literature; wrote Jana Gana Mana.' },
        { date: '2025-08-19', category: 'Books', priority: 'High', content: 'Discovery of India written by Jawaharlal Nehru in 1944 during imprisonment at Ahmednagar Fort; covers Indian history, culture, and philosophy.' },
        
        // ===== MONUMENTS & ARCHITECTURE =====
        { date: '2025-09-17', category: 'Heritage', priority: 'High', content: 'Qutub Minar in Delhi built by Qutub-ud-din Aibak in 1193; tallest brick minaret in world at 72.5 meters; UNESCO World Heritage Site since 1993.' },
        { date: '2025-11-17', category: 'Monuments', priority: 'High', content: 'Taj Mahal built by Shah Jahan in memory of wife Mumtaz Mahal; completed in 1653; UNESCO World Heritage Site; one of Seven Wonders of World.' },
        
        // ===== IMPORTANT COMMITTEES & COMMISSIONS =====
        { date: '2025-12-26', category: 'Polity', priority: 'High', content: 'Election Commission of India established on January 25, 1950; currently has 3 Election Commissioners; conducts elections to Parliament, State Legislatures, President, VP.' }
    ],

    '2024': [
        { date: '2024-01-22', category: 'Culture', priority: 'High', content: 'Ram Mandir Pran Pratishtha ceremony held in Ayodhya, presided over by PM Narendra Modi.' },
        { date: '2024-02-01', category: 'Economy', priority: 'High', content: 'Interim Budget 2024-25 presented by Finance Minister Nirmala Sitharaman.' },
        { date: '2024-03-11', category: 'Polity', priority: 'High', content: 'Government notifies rules for Citizenship Amendment Act (CAA), 2019.' },
        { date: '2024-04-19', category: 'Elections', priority: 'High', content: 'Lok Sabha Elections 2024 begin, spanning seven phases.' },
        { date: '2024-06-09', category: 'Polity', priority: 'High', content: 'Narendra Modi sworn in as Prime Minister for a third consecutive term.' },
        { date: '2024-06-29', category: 'Sports', priority: 'High', content: 'India wins ICC T20 World Cup 2024, defeating South Africa in the final.' },
        { date: '2024-07-23', category: 'Economy', priority: 'High', content: 'Union Budget 2024-25 presented, focusing on employment and middle class.' },
        { date: '2024-08-07', category: 'Sports', priority: 'Medium', content: 'Vinesh Phogat disqualified from Paris Olympics wrestling final due to weight issues.' },
        { date: '2024-08-08', category: 'Sports', priority: 'High', content: 'Neeraj Chopra wins silver medal in javelin at Paris Olympics 2024.' },
        { date: '2024-09-02', category: 'Defense', priority: 'Medium', content: 'INS Arighat, India\'s second nuclear-powered ballistic missile submarine, commissioned.' },
        { date: '2024-10-09', category: 'Economy', priority: 'High', content: 'Ratan Tata, legendary industrialist and philanthropist, passes away at 86.' },
        { date: '2024-11-05', category: 'International', priority: 'High', content: 'Donald Trump wins US Presidential Election 2024.' },
        { date: '2024-12-04', category: 'Space', priority: 'High', content: 'ISRO successfully launches Proba-3 mission in collaboration with ESA.' }
    ],
    '2023': [
        { date: '2023-01-26', category: 'Defense', priority: 'High', content: 'India displays indigenous weapons at Republic Day parade including Tejas fighter jets.' },
        { date: '2023-02-01', category: 'Economy', priority: 'High', content: 'Union Budget 2023-24 presented with focus on infrastructure and digital economy.' },
        { date: '2023-03-13', category: 'International', priority: 'Medium', content: 'India-Australia conclude joint naval exercise AUSINDEX-23.' },
        { date: '2023-04-14', category: 'Space', priority: 'Medium', content: 'ISRO successfully tests Gaganyaan crew escape system.' },
        { date: '2023-05-09', category: 'Health', priority: 'High', content: 'WHO declares end to COVID-19 global health emergency.' },
        { date: '2023-05-28', category: 'Polity', priority: 'High', content: 'New Parliament Building inaugurated by PM Narendra Modi.' },
        { date: '2023-07-14', category: 'Space', priority: 'High', content: 'Chandrayaan-3 successfully launched from Satish Dhawan Space Centre.' },
        { date: '2023-08-23', category: 'Space', priority: 'High', content: 'Chandrayaan-3 successfully lands on the lunar south pole, India becomes fourth nation to land on Moon.' },
        { date: '2023-09-09', category: 'International', priority: 'High', content: 'G20 Summit held in New Delhi; African Union becomes permanent member.' },
        { date: '2023-10-05', category: 'Sports', priority: 'High', content: 'India wins gold at Asian Games 2023 in cricket (men\'s and women\'s teams).' },
        { date: '2023-11-15', category: 'Sports', priority: 'High', content: 'India hosts ICC Cricket World Cup 2023; Australia defeats India in final.' },
        { date: '2023-12-11', category: 'Climate', priority: 'Medium', content: 'India announces green hydrogen mission target of 5 MMT production by 2030.' }
    ],
    '2022': [
        { date: '2022-01-21', category: 'Health', priority: 'High', content: 'India administers 1.5 billion COVID-19 vaccine doses.' },
        { date: '2022-02-04', category: 'Sports', priority: 'High', content: 'Beijing Winter Olympics begin; India participates with six athletes.' },
        { date: '2022-03-21', category: 'Economy', priority: 'Medium', content: 'India exports record amount of agricultural products worth $50 billion.' },
        { date: '2022-04-22', category: 'Space', priority: 'Medium', content: 'ISRO successfully launches EOS-04 earth observation satellite.' },
        { date: '2022-05-30', category: 'Aviation', priority: 'High', content: 'India becomes third-largest domestic aviation market globally.' },
        { date: '2022-06-30', category: 'Taxation', priority: 'High', content: 'GST completes 5 years of implementation in India.' },
        { date: '2022-07-18', category: 'Elections', priority: 'High', content: 'Droupadi Murmu elected as 15th President of India, first tribal woman president.' },
        { date: '2022-07-25', category: 'Polity', priority: 'High', content: 'Droupadi Murmu takes oath as President of India.' },
        { date: '2022-09-02', category: 'Defense', priority: 'High', content: 'INS Vikrant, India\'s first indigenous aircraft carrier, commissioned into Indian Navy.' },
        { date: '2022-10-01', category: 'Economy', priority: 'Medium', content: 'India becomes world\'s fifth-largest economy, surpassing United Kingdom.' },
        { date: '2022-11-13', category: 'Environment', priority: 'High', content: 'India hosts COP27 side event on climate finance and net-zero commitments.' },
        { date: '2022-12-18', category: 'Sports', priority: 'High', content: 'Argentina wins FIFA World Cup 2022 in Qatar, defeating France in final.' }
    ],
    '2021': [
        { date: '2021-01-16', category: 'Health', priority: 'High', content: 'India launches world\'s largest COVID-19 vaccination drive.' },
        { date: '2021-02-01', category: 'Economy', priority: 'High', content: 'Union Budget 2021-22 announced with increased healthcare allocation.' },
        { date: '2021-03-08', category: 'International', priority: 'Medium', content: 'India participates in first Quad Leaders Summit virtually.' },
        { date: '2021-04-21', category: 'Health', priority: 'High', content: 'India faces severe second wave of COVID-19 pandemic.' },
        { date: '2021-05-07', category: 'Space', priority: 'Medium', content: 'Indian Space Research Organisation announces Gaganyaan mission timeline.' },
        { date: '2021-06-14', category: 'Economy', priority: 'Medium', content: 'India\'s forex reserves cross $600 billion for first time.' },
        { date: '2021-07-23', category: 'Sports', priority: 'High', content: 'Tokyo Olympics 2020 begin after one-year delay due to pandemic.' },
        { date: '2021-08-07', category: 'Sports', priority: 'High', content: 'Neeraj Chopra wins Gold medal in Javelin throw at Tokyo Olympics.' },
        { date: '2021-09-17', category: 'Defense', priority: 'High', content: 'India, Australia, US strengthen Quad partnership with expanded cooperation.' },
        { date: '2021-10-24', category: 'Environment', priority: 'High', content: 'India announces net-zero emissions target by 2070 at COP26 Glasgow.' },
        { date: '2021-11-19', category: 'Polity', priority: 'High', content: 'Parliament passes bill to repeal three farm laws.' },
        { date: '2021-12-13', category: 'Defense', priority: 'Medium', content: 'Chief of Defence Staff Gen Bipin Rawat dies in helicopter crash.' }
    ],
    '2020': [
        { date: '2020-01-30', category: 'Health', priority: 'High', content: 'India reports first COVID-19 case in Kerala.' },
        { date: '2020-02-24', category: 'International', priority: 'High', content: 'US President Donald Trump visits India, "Namaste Trump" event held in Ahmedabad.' },
        { date: '2020-03-24', category: 'Health', priority: 'High', content: 'India announces nationwide lockdown to combat COVID-19 pandemic.' },
        { date: '2020-04-05', category: 'Culture', priority: 'Medium', content: 'PM Modi calls for 9-minute blackout with candles/lamps.' },
        { date: '2020-05-12', category: 'Economy', priority: 'High', content: 'Atmanirbhar Bharat Abhiyan announced worth Rs 20 lakh crore.' },
        { date: '2020-06-15', category: 'Defense', priority: 'High', content: 'Galwan Valley clash between Indian and Chinese troops.' },
        { date: '2020-07-01', category: 'Taxation', priority: 'High', content: 'GST Compensation Cess extended till March 2026.' },
        { date: '2020-08-05', category: 'Polity', priority: 'High', content: 'Bhoomi Pujan for Ram Temple construction in Ayodhya.' },
        { date: '2020-09-14', category: 'International', priority: 'Medium', content: 'India-China LAC standoff continues.' },
        { date: '2020-10-13', category: 'Economy', priority: 'Medium', content: 'India\'s GDP contracts 7.5% in Q2.' },
        { date: '2020-11-15', category: 'International', priority: 'High', content: 'India decides not to join RCEP.' },
        { date: '2020-12-04', category: 'Agriculture', priority: 'High', content: 'Farmers begin protests against farm laws.' }
    ],
    '2019': [
        { date: '2019-01-03', category: 'Space', priority: 'Medium', content: 'ISRO announces Gaganyaan mission.' },
        { date: '2019-02-14', category: 'Defense', priority: 'High', content: 'Pulwama terror attack kills 40 CRPF personnel.' },
        { date: '2019-02-26', category: 'Defense', priority: 'High', content: 'Balakot airstrike conducted by Indian Air Force.' },
        { date: '2019-03-27', category: 'Space', priority: 'High', content: 'Mission Shakti ASAT test successful.' },
        { date: '2019-04-11', category: 'Elections', priority: 'High', content: 'Lok Sabha Elections 2019 begin.' },
        { date: '2019-05-23', category: 'Elections', priority: 'High', content: 'NDA wins Lok Sabha elections.' },
        { date: '2019-05-30', category: 'Polity', priority: 'High', content: 'Narendra Modi sworn in for second term.' },
        { date: '2019-07-22', category: 'Space', priority: 'High', content: 'Chandrayaan-2 launched.' },
        { date: '2019-08-05', category: 'Polity', priority: 'High', content: 'Article 370 abrogated.' },
        { date: '2019-09-07', category: 'Space', priority: 'Medium', content: 'Chandrayaan-2 lander loses contact.' },
        { date: '2019-10-02', category: 'Environment', priority: 'Medium', content: 'Swachh Bharat completes 5 years.' },
        { date: '2019-11-09', category: 'Judiciary', priority: 'High', content: 'Ayodhya verdict delivered.' },
        { date: '2019-12-11', category: 'Polity', priority: 'High', content: 'Citizenship Amendment Act passed.' }
    ],
    '2018': [
        { date: '2018-01-10', category: 'Health', priority: 'High', content: 'Ayushman Bharat announced in Budget 2018.' },
        { date: '2018-02-01', category: 'Economy', priority: 'High', content: 'Union Budget 2018-19 presented.' },
        { date: '2018-03-21', category: 'Space', priority: 'Medium', content: 'GSAT-6A launched by ISRO.' },
        { date: '2018-04-13', category: 'International', priority: 'High', content: 'Wuhan informal summit held.' },
        { date: '2018-05-05', category: 'Economy', priority: 'Medium', content: 'GDP growth reaches 7.7%.' },
        { date: '2018-06-21', category: 'Culture', priority: 'Medium', content: 'International Yoga Day observed.' },
        { date: '2018-07-17', category: 'Elections', priority: 'High', content: 'Ram Nath Kovind completes one year as President.' },
        { date: '2018-08-15', category: 'Health', priority: 'High', content: 'Ayushman Bharat launch announced.' },
        { date: '2018-09-06', category: 'Judiciary', priority: 'High', content: 'Section 377 decriminalized.' },
        { date: '2018-09-23', category: 'Health', priority: 'High', content: 'Ayushman Bharat officially launched.' },
        { date: '2018-10-31', category: 'Culture', priority: 'High', content: 'Statue of Unity inaugurated.' },
        { date: '2018-11-01', category: 'Economy', priority: 'Medium', content: 'RBI maintains repo rate at 6.5%.' },
        { date: '2018-12-07', category: 'Politics', priority: 'High', content: 'Congress wins MP, Rajasthan, Chhattisgarh elections.' }
    ]
};

module.exports = {mockYearlyData};
