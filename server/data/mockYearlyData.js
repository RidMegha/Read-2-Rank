const mockYearlyData = {
    '2025': [

        // JANUARY 2025 (REAL + VERIFIED)
        { date: '2025-01-01', category: 'International', priority: 'High', content: 'Truck attack in New Orleans, USA, during New Year celebrations; terrorism-related investigation confirmed.' },
        { date: '2025-01-12', category: 'National', priority: 'High', content: 'National Youth Day observed on the birth anniversary of Swami Vivekananda.' },
        { date: '2025-01-20', category: 'International', priority: 'High', content: 'Donald Trump sworn in as the 47th President of the United States.' },
        { date: '2025-01-26', category: 'National', priority: 'High', content: 'India celebrated its 76th Republic Day; President of Indonesia Prabowo Subianto was the Chief Guest.' },

        // FEBRUARY 2025 (VERIFIED OBSERVANCES)
        { date: '2025-02-01', category: 'Economy', priority: 'High', content: 'Union Budget 2025–26 presented in Parliament of India.' },
        { date: '2025-02-04', category: 'Health', priority: 'High', content: 'World Cancer Day observed globally.' },
        { date: '2025-02-11', category: 'Science', priority: 'Medium', content: 'International Day of Women and Girls in Science observed.' },
        { date: '2025-02-28', category: 'Science', priority: 'High', content: 'National Science Day observed in India.' },

        // MARCH 2025
        { date: '2025-03-08', category: 'Social', priority: 'High', content: 'International Women’s Day observed worldwide.' },
        { date: '2025-03-15', category: 'Consumer', priority: 'Medium', content: 'World Consumer Rights Day observed globally.' },
        { date: '2025-03-22', category: 'Environment', priority: 'High', content: 'World Water Day observed globally.' },

        // APRIL 2025
        { date: '2025-04-07', category: 'Health', priority: 'High', content: 'World Health Day observed globally.' },
        { date: '2025-04-14', category: 'National', priority: 'High', content: 'Dr. B. R. Ambedkar Jayanti observed in India.' },
        { date: '2025-04-22', category: 'Environment', priority: 'High', content: 'Earth Day observed worldwide.' },

        // MAY 2025
        { date: '2025-05-01', category: 'Labor', priority: 'High', content: 'International Labour Day observed globally.' },
        { date: '2025-05-03', category: 'Press', priority: 'Medium', content: 'World Press Freedom Day observed.' },
        { date: '2025-05-11', category: 'Science', priority: 'High', content: 'National Technology Day observed in India.' },
        { date: '2025-05-31', category: 'Health', priority: 'High', content: 'World No Tobacco Day observed globally.' },

        // JUNE 2025
        { date: '2025-06-05', category: 'Environment', priority: 'High', content: 'World Environment Day observed globally.' },
        { date: '2025-06-08', category: 'Environment', priority: 'Medium', content: 'World Oceans Day observed.' },
        { date: '2025-06-21', category: 'Culture', priority: 'High', content: 'International Yoga Day celebrated worldwide.' },

        // JULY 2025
        { date: '2025-07-01', category: 'Economy', priority: 'High', content: 'GST Day observed in India.' },
        { date: '2025-07-11', category: 'Population', priority: 'Medium', content: 'World Population Day observed globally.' },
        { date: '2025-07-26', category: 'Defense', priority: 'High', content: 'Kargil Vijay Diwas observed in India.' },

        // AUGUST 2025
        { date: '2025-08-09', category: 'History', priority: 'High', content: 'Quit India Movement anniversary observed in India.' },
        { date: '2025-08-12', category: 'Youth', priority: 'Medium', content: 'International Youth Day observed.' },
        { date: '2025-08-15', category: 'National', priority: 'High', content: 'India celebrated its 79th Independence Day.' },
        { date: '2025-08-29', category: 'Sports', priority: 'Medium', content: 'National Sports Day observed on the birth anniversary of Major Dhyan Chand.' },

        // SEPTEMBER 2025
        { date: '2025-09-05', category: 'Education', priority: 'High', content: 'Teachers’ Day observed in India.' },
        { date: '2025-09-08', category: 'Education', priority: 'Medium', content: 'International Literacy Day observed.' },
        { date: '2025-09-14', category: 'Culture', priority: 'High', content: 'Hindi Diwas observed in India.' },
        { date: '2025-09-27', category: 'Tourism', priority: 'Medium', content: 'World Tourism Day observed globally.' },

        // OCTOBER 2025
        { date: '2025-10-02', category: 'National', priority: 'High', content: 'Gandhi Jayanti observed in India.' },
        { date: '2025-10-16', category: 'Food', priority: 'Medium', content: 'World Food Day observed globally.' },

        // NOVEMBER 2025
        { date: '2025-11-11', category: 'Education', priority: 'Medium', content: 'National Education Day observed in India.' },
        { date: '2025-11-14', category: 'Children', priority: 'High', content: 'Children’s Day observed in India.' },
        { date: '2025-11-26', category: 'National', priority: 'High', content: 'Constitution Day (Samvidhan Diwas) observed in India.' },

        // DECEMBER 2025
        { date: '2025-12-01', category: 'Health', priority: 'Medium', content: 'World AIDS Day observed globally.' },
        { date: '2025-12-10', category: 'Rights', priority: 'High', content: 'Human Rights Day observed worldwide.' },
        { date: '2025-12-25', category: 'National', priority: 'High', content: 'Good Governance Day observed in India.' }
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
