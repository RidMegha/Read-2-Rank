// =====================================================
// DAILY MOCK DATA – DECEMBER 2025 (1st–26th)
// REAL, STATIC & EXAM-SAFE GK ONLY
// =====================================================

const getMockDailyDataDecember_January = (specificDate = null) => {
    const dailyData = {

        '2025-12-01': [
            { date: '2025-12-01', category: 'International Day', priority: 'High', content: 'World AIDS Day observed globally to raise awareness about HIV/AIDS.' },
            { date: '2025-12-01', category: 'Health', priority: 'Medium', content: 'Theme of World AIDS Day is announced annually by UNAIDS.' },
            { date: '2025-12-01', category: 'Economy', priority: 'Medium', content: 'RBI generally holds MPC meetings during early December.' },
            { date: '2025-12-01', category: 'Environment', priority: 'Low', content: 'December marks the beginning of winter meteorological season in India.' }
        ],

        '2025-12-02': [
            { date: '2025-12-02', category: 'International Day', priority: 'High', content: 'International Day for the Abolition of Slavery observed by the UN.' },
            { date: '2025-12-02', category: 'History', priority: 'Medium', content: 'Slavery abolition focuses on modern forms such as human trafficking and child labor.' },
            { date: '2025-12-02', category: 'Geography', priority: 'Low', content: 'December sees retreating monsoon completely withdraw from India.' },
            { date: '2025-12-02', category: 'International', priority: 'Low', content: 'UN General Assembly promotes human rights awareness during December.' }
        ],

        '2025-12-03': [
            { date: '2025-12-03', category: 'International Day', priority: 'High', content: 'International Day of Persons with Disabilities observed globally.' },
            { date: '2025-12-03', category: 'Polity', priority: 'Medium', content: 'Rights of Persons with Disabilities Act, 2016 governs disability rights in India.' },
            { date: '2025-12-03', category: 'Social Justice', priority: 'Medium', content: 'Accessibility and inclusion are core themes of disability policies.' },
            { date: '2025-12-03', category: 'UN', priority: 'Low', content: 'UN promotes inclusive development under SDG 10 (Reduced Inequalities).' }
        ],

        '2025-12-04': [
            { date: '2025-12-04', category: 'National Day', priority: 'High', content: 'Indian Navy Day celebrated to commemorate Operation Trident (1971).' },
            { date: '2025-12-04', category: 'Defense', priority: 'Medium', content: 'Indian Navy operates under the Ministry of Defence.' },
            { date: '2025-12-04', category: 'History', priority: 'Medium', content: 'Operation Trident targeted Karachi harbor during the Indo-Pak war.' },
            { date: '2025-12-04', category: 'Military', priority: 'Low', content: 'Indian Armed Forces consist of Army, Navy, and Air Force.' }
        ],

        '2025-12-05': [
            { date: '2025-12-05', category: 'International Day', priority: 'High', content: 'International Volunteer Day observed for Economic and Social Development.' },
            { date: '2025-12-05', category: 'UN', priority: 'Medium', content: 'UN Volunteers program operates in over 150 countries.' },
            { date: '2025-12-05', category: 'Social Work', priority: 'Low', content: 'Volunteering supports achievement of Sustainable Development Goals.' },
            { date: '2025-12-05', category: 'Governance', priority: 'Low', content: 'Civil society participation strengthens democracy.' }
        ],

        '2025-12-06': [
            { date: '2025-12-06', category: 'National Day', priority: 'High', content: 'Mahaparinirvan Diwas observed in memory of Dr. B. R. Ambedkar.' },
            { date: '2025-12-06', category: 'Polity', priority: 'High', content: 'Dr. Ambedkar was Chairman of the Drafting Committee of Indian Constitution.' },
            { date: '2025-12-06', category: 'History', priority: 'Medium', content: 'He is known as the chief architect of the Indian Constitution.' },
            { date: '2025-12-06', category: 'Social Justice', priority: 'Medium', content: 'Ambedkar championed Dalit rights and social equality.' }
        ],

        '2025-12-07': [
            { date: '2025-12-07', category: 'National Day', priority: 'High', content: 'Armed Forces Flag Day observed in India.' },
            { date: '2025-12-07', category: 'Defense', priority: 'Medium', content: 'Funds collected support welfare of ex-servicemen and martyrs’ families.' },
            { date: '2025-12-07', category: 'Military', priority: 'Low', content: 'India has one of the largest armed forces in the world.' },
            { date: '2025-12-07', category: 'Civics', priority: 'Low', content: 'Civil-military relations are vital in democratic governance.' }
        ],

        '2025-12-08': [
            { date: '2025-12-08', category: 'International Day', priority: 'High', content: 'International Anti-Corruption Day observed globally.' },
            { date: '2025-12-08', category: 'Governance', priority: 'Medium', content: 'UNCAC is the only legally binding anti-corruption treaty.' },
            { date: '2025-12-08', category: 'India', priority: 'Medium', content: 'Central Vigilance Commission addresses corruption in India.' },
            { date: '2025-12-08', category: 'Ethics', priority: 'Low', content: 'Transparency improves public trust in institutions.' }
        ],

        '2025-12-09': [
            { date: '2025-12-09', category: 'International Day', priority: 'High', content: 'International Day of Commemoration of Victims of Genocide observed.' },
            { date: '2025-12-09', category: 'UN', priority: 'Medium', content: 'Genocide Convention was adopted in 1948.' },
            { date: '2025-12-09', category: 'History', priority: 'Medium', content: 'Holocaust is a major reference in genocide studies.' },
            { date: '2025-12-09', category: 'Ethics', priority: 'Low', content: 'Prevention of mass atrocities is a global responsibility.' }
        ],

        '2025-12-10': [
            { date: '2025-12-10', category: 'International Day', priority: 'High', content: 'Human Rights Day observed worldwide.' },
            { date: '2025-12-10', category: 'History', priority: 'High', content: 'Universal Declaration of Human Rights adopted in 1948.' },
            { date: '2025-12-10', category: 'Polity', priority: 'Medium', content: 'Fundamental Rights in India are inspired by UDHR.' },
            { date: '2025-12-10', category: 'UN', priority: 'Low', content: 'Office of UN High Commissioner for Human Rights oversees rights protection.' }
        ],

        // -------- 11 to 26 continue in same VERIFIED pattern --------

        '2025-12-11': [
            { date: '2025-12-11', category: 'International Day', priority: 'High', content: 'International Mountain Day observed.' },
            { date: '2025-12-11', category: 'Geography', priority: 'Medium', content: 'Himalayas play a key role in Indian climate.' },
            { date: '2025-12-11', category: 'Environment', priority: 'Medium', content: 'Mountain ecosystems are biodiversity hotspots.' },
            { date: '2025-12-11', category: 'Climate', priority: 'Low', content: 'Glacial melting impacts river systems.' }
        ],

        '2025-12-12': [
            { date: '2025-12-12', category: 'International Day', priority: 'High', content: 'Universal Health Coverage Day observed.' },
            { date: '2025-12-12', category: 'Health', priority: 'Medium', content: 'Ayushman Bharat promotes universal health coverage in India.' },
            { date: '2025-12-12', category: 'UN', priority: 'Medium', content: 'UHC is part of Sustainable Development Goal 3.' },
            { date: '2025-12-12', category: 'Policy', priority: 'Low', content: 'Public health financing improves outcomes.' }
        ],

        '2025-12-13': [
            { date: '2025-12-13', category: 'National Day', priority: 'High', content: 'National Energy Conservation Day observed in India.' },
            { date: '2025-12-13', category: 'Energy', priority: 'Medium', content: 'Bureau of Energy Efficiency promotes energy efficiency.' },
            { date: '2025-12-13', category: 'Environment', priority: 'Medium', content: 'Energy conservation reduces carbon emissions.' },
            { date: '2025-12-13', category: 'Economy', priority: 'Low', content: 'Efficient energy use lowers import dependency.' }
        ],

        '2025-12-14': [
            { date: '2025-12-14', category: 'History', priority: 'Medium', content: 'Energy Conservation Week activities continue in India.' },
            { date: '2025-12-14', category: 'Climate', priority: 'Low', content: 'Renewable energy supports climate goals.' },
            { date: '2025-12-14', category: 'Policy', priority: 'Low', content: 'India targets net-zero emissions by 2070.' },
            { date: '2025-12-14', category: 'Technology', priority: 'Low', content: 'LED adoption reduces electricity consumption.' }
        ],

        '2025-12-15': [
            { date: '2025-12-15', category: 'International Day', priority: 'High', content: 'International Tea Day observed.' },
            { date: '2025-12-15', category: 'Economy', priority: 'Medium', content: 'India is among the largest tea producers globally.' },
            { date: '2025-12-15', category: 'Agriculture', priority: 'Medium', content: 'Assam is the largest tea-producing state in India.' },
            { date: '2025-12-15', category: 'Culture', priority: 'Low', content: 'Tea is integral to Indian lifestyle.' }
        ],

        '2025-12-16': [
            { date: '2025-12-16', category: 'National Day', priority: 'High', content: 'Vijay Diwas commemorates India’s victory in the 1971 war.' },
            { date: '2025-12-16', category: 'History', priority: 'High', content: 'Bangladesh Liberation War ended in 1971.' },
            { date: '2025-12-16', category: 'Defense', priority: 'Medium', content: 'Indian Armed Forces played a decisive role.' },
            { date: '2025-12-16', category: 'International', priority: 'Low', content: 'Bangladesh became an independent nation.' }
        ],

        '2025-12-17': [
            { date: '2025-12-17', category: 'International Day', priority: 'Medium', content: 'International Day to End Violence Against Sex Workers observed.' },
            { date: '2025-12-17', category: 'Human Rights', priority: 'Medium', content: 'Focus on dignity and safety of marginalized communities.' },
            { date: '2025-12-17', category: 'UN', priority: 'Low', content: 'Human rights form the basis of UN Charter.' },
            { date: '2025-12-17', category: 'Ethics', priority: 'Low', content: 'Inclusive societies strengthen democracy.' }
        ],

        '2025-12-18': [
            { date: '2025-12-18', category: 'International Day', priority: 'High', content: 'International Migrants Day observed.' },
            { date: '2025-12-18', category: 'Economy', priority: 'Medium', content: 'Remittances contribute significantly to India’s economy.' },
            { date: '2025-12-18', category: 'UN', priority: 'Medium', content: 'Global Compact for Migration adopted in 2018.' },
            { date: '2025-12-18', category: 'Social', priority: 'Low', content: 'Migration impacts urbanization patterns.' }
        ],

        '2025-12-19': [
            { date: '2025-12-19', category: 'National Initiative', priority: 'High', content: 'Good Governance Week begins in India.' },
            { date: '2025-12-19', category: 'Polity', priority: 'Medium', content: 'Citizen-centric administration is emphasized.' },
            { date: '2025-12-19', category: 'Governance', priority: 'Medium', content: 'Transparency improves service delivery.' },
            { date: '2025-12-19', category: 'Ethics', priority: 'Low', content: 'Accountability is core to governance.' }
        ],

        '2025-12-20': [
            { date: '2025-12-20', category: 'International Day', priority: 'High', content: 'International Human Solidarity Day observed.' },
            { date: '2025-12-20', category: 'UN', priority: 'Medium', content: 'Solidarity supports global development.' },
            { date: '2025-12-20', category: 'Ethics', priority: 'Low', content: 'Collective responsibility strengthens peace.' },
            { date: '2025-12-20', category: 'Society', priority: 'Low', content: 'Global challenges require cooperation.' }
        ],

        '2025-12-21': [
            { date: '2025-12-21', category: 'Astronomy', priority: 'High', content: 'Winter Solstice marks the shortest day in Northern Hemisphere.' },
            { date: '2025-12-21', category: 'Science', priority: 'Medium', content: 'Earth’s axial tilt causes solstices.' },
            { date: '2025-12-21', category: 'Geography', priority: 'Medium', content: 'Southern Hemisphere experiences summer solstice.' },
            { date: '2025-12-21', category: 'Climate', priority: 'Low', content: 'Seasonal cycles influence agriculture.' }
        ],

        '2025-12-22': [
            { date: '2025-12-22', category: 'Environment', priority: 'Low', content: 'Winter conditions intensify in North India.' },
            { date: '2025-12-22', category: 'Geography', priority: 'Low', content: 'Cold waves affect northern plains.' },
            { date: '2025-12-22', category: 'Health', priority: 'Low', content: 'Cold weather impacts respiratory health.' },
            { date: '2025-12-22', category: 'Disaster Management', priority: 'Low', content: 'IMD issues cold wave advisories.' }
        ],

        '2025-12-23': [
            { date: '2025-12-23', category: 'Environment', priority: 'Low', content: 'Fog conditions common in North India during late December.' },
            { date: '2025-12-23', category: 'Transport', priority: 'Low', content: 'Fog affects road, rail, and air traffic.' },
            { date: '2025-12-23', category: 'Meteorology', priority: 'Low', content: 'IMD monitors winter weather patterns.' },
            { date: '2025-12-23', category: 'Geography', priority: 'Low', content: 'Western disturbances influence winter rainfall.' }
        ],

        '2025-12-24': [
            { date: '2025-12-24', category: 'Culture', priority: 'Medium', content: 'Christmas Eve observed by Christian communities worldwide.' },
            { date: '2025-12-24', category: 'History', priority: 'Low', content: 'Christianity is one of the world’s oldest religions.' },
            { date: '2025-12-24', category: 'Society', priority: 'Low', content: 'Religious diversity is a feature of Indian society.' },
            { date: '2025-12-24', category: 'Ethics', priority: 'Low', content: 'Festivals promote social harmony.' }
        ],

        '2025-12-25': [
            { date: '2025-12-25', category: 'National Day', priority: 'High', content: 'Good Governance Day observed on birth anniversary of Atal Bihari Vajpayee.' },
            { date: '2025-12-25', category: 'International', priority: 'High', content: 'Christmas celebrated worldwide.' },
            { date: '2025-12-25', category: 'Polity', priority: 'Medium', content: 'Atal Bihari Vajpayee served as Prime Minister three times.' },
            { date: '2025-12-25', category: 'Culture', priority: 'Low', content: 'Public holidays vary by country.' }
        ],

        '2025-12-26': [
            { date: '2025-12-26', category: 'National Day', priority: 'High', content: 'Veer Bal Diwas observed in India.' },
            { date: '2025-12-26', category: 'History', priority: 'High', content: 'Honors sacrifice of Guru Gobind Singh’s sons.' },
            { date: '2025-12-26', category: 'Culture', priority: 'Medium', content: 'Sikhism emphasizes courage and sacrifice.' },
            { date: '2025-12-26', category: 'Ethics', priority: 'Low', content: 'Moral values inspire national identity.' }
        ],

        '2025-12-27': [
            { date: '2025-12-27', category: 'Culture', priority: 'Medium', content: 'Preparation for year-end celebrations; cultural programs across India.' },
            { date: '2025-12-27', category: 'Economy', priority: 'Low', content: 'Year-end economic reviews begin; fiscal performance assessment.' },
            { date: '2025-12-27', category: 'Environment', priority: 'Low', content: 'Winter tourism peaks in hill stations across North India.' },
            { date: '2025-12-27', category: 'Society', priority: 'Low', content: 'Year-end charitable activities and donations increase nationwide.' }
        ],

        '2025-12-28': [
            { date: '2025-12-28', category: 'Polity', priority: 'High', content: 'Article 356 of Indian Constitution deals with President\'s Rule in states; can be imposed on recommendation of Governor or otherwise.' },
            { date: '2025-12-28', category: 'History', priority: 'High', content: 'Indian National Congress founded on December 28, 1885 in Bombay (now Mumbai) by Allan Octavian Hume.' },
            { date: '2025-12-28', category: 'Economy', priority: 'Medium', content: 'Reserve Bank of India regulates monetary policy through tools like Repo Rate, Reverse Repo Rate, CRR, and SLR.' },
            { date: '2025-12-28', category: 'Geography', priority: 'Medium', content: 'India shares land borders with 7 countries: Pakistan, Afghanistan, China, Nepal, Bhutan, Myanmar, and Bangladesh.' }
        ],

        '2025-12-29': [
            { date: '2025-12-29', category: 'Science', priority: 'High', content: 'Chandrayan-3 successfully landed on Moon\'s South Pole on August 23, 2023, making India fourth country to achieve soft landing.' },
            { date: '2025-12-29', category: 'Awards', priority: 'High', content: 'Bharat Ratna is India\'s highest civilian award, instituted in 1954; limited to maximum three recipients per year.' },
            { date: '2025-12-29', category: 'Constitution', priority: 'Medium', content: 'Fundamental Duties were added to Indian Constitution by 42nd Amendment Act, 1976 under Article 51A.' },
            { date: '2025-12-29', category: 'Environment', priority: 'Medium', content: 'Western Ghats are biodiversity hotspot; recognized as UNESCO World Heritage Site in 2012 across six states.' }
        ],

        '2025-12-30': [
            { date: '2025-12-30', category: 'Sports', priority: 'High', content: 'Major Dhyan Chand is known as Hockey Wizard; National Sports Day celebrated on his birth anniversary August 29.' },
            { date: '2025-12-30', category: 'Economics', priority: 'High', content: 'GST (Goods and Services Tax) implemented from July 1, 2017; replaced multiple indirect taxes with single tax system.' },
            { date: '2025-12-30', category: 'Defense', priority: 'Medium', content: 'INS Vikrant is India\'s first indigenous aircraft carrier; commissioned in September 2022, built at Cochin Shipyard.' },
            { date: '2025-12-30', category: 'Books', priority: 'Medium', content: 'Discovery of India written by Jawaharlal Nehru in 1944 during imprisonment at Ahmednagar Fort.' }
        ],

        '2025-12-31': [
            { date: '2025-12-31', category: 'History', priority: 'High', content: 'Quit India Movement launched on August 9, 1942 by Mahatma Gandhi with slogan "Do or Die" at Gowalia Tank, Mumbai.' },
            { date: '2025-12-31', category: 'Geography', priority: 'High', content: 'Standard Meridian of India passes through 82°30\'E longitude passing through Mirzapur, Uttar Pradesh; determines Indian Standard Time.' },
            { date: '2025-12-31', category: 'Polity', priority: 'Medium', content: 'Supreme Court of India established on January 26, 1950; has 34 judges including Chief Justice; retirement age is 65 years.' },
            { date: '2025-12-31', category: 'Culture', priority: 'Medium', content: 'UNESCO recognizes 42 World Heritage Sites in India including 34 cultural, 7 natural, and 1 mixed site (as of 2023).' }
        ],

        // JANUARY 2026

        '2026-01-01': [
            { date: '2026-01-01', category: 'Polity', priority: 'High', content: 'Preamble of Indian Constitution declares India as Sovereign, Socialist, Secular, Democratic, Republic; Socialist and Secular added by 42nd Amendment.' },
            { date: '2026-01-01', category: 'Science', priority: 'High', content: 'ISRO\'s Mars Orbiter Mission (Mangalyaan) launched in 2013; India became first Asian nation to reach Mars orbit in first attempt.' },
            { date: '2026-01-01', category: 'Economy', priority: 'Medium', content: 'NITI Aayog replaced Planning Commission in 2015; serves as think tank and provides directional policy inputs to government.' },
            { date: '2026-01-01', category: 'Rivers', priority: 'Medium', content: 'Ganga is longest river in India (2525 km); originates from Gangotri Glacier, flows through 5 states before meeting Bay of Bengal.' }
        ],

        '2026-01-02': [
            { date: '2026-01-02', category: 'Defense', priority: 'High', content: 'Agni-V is India\'s longest-range ballistic missile with 5000+ km range; can reach targets across Asia including northern China.' },
            { date: '2026-01-02', category: 'History', priority: 'High', content: 'Battle of Plassey fought on June 23, 1757 between British East India Company and Nawab of Bengal Siraj-ud-Daulah; marked British rule beginning.' },
            { date: '2026-01-02', category: 'Literature', priority: 'Medium', content: 'Rabindranath Tagore won Nobel Prize in Literature in 1913 for Gitanjali; first non-European to receive Nobel in Literature.' },
            { date: '2026-01-02', category: 'Climate', priority: 'Medium', content: 'India experiences tropical monsoon climate; southwest monsoon (June-September) contributes 75% of annual rainfall.' }
        ],

        '2026-01-03': [
            { date: '2026-01-03', category: 'Constitution', priority: 'High', content: 'Article 370 of Indian Constitution granted special status to Jammu & Kashmir; abrogated on August 5, 2019 by Presidential Order.' },
            { date: '2026-01-03', category: 'Space', priority: 'High', content: 'Aryabhata was India\'s first satellite launched on April 19, 1975 by Soviet Union; named after ancient mathematician Aryabhata.' },
            { date: '2026-01-03', category: 'Monuments', priority: 'Medium', content: 'Qutub Minar in Delhi built by Qutub-ud-din Aibak in 1193; tallest brick minaret in world at 72.5 meters height.' },
            { date: '2026-01-03', category: 'Judiciary', priority: 'Medium', content: 'Public Interest Litigation (PIL) can be filed by any citizen in Supreme Court or High Court for public interest matters.' }
        ],

        '2026-01-04': [
            { date: '2026-01-04', category: 'Economics', priority: 'High', content: 'SEBI (Securities and Exchange Board of India) established in 1992; regulates stock exchanges and protects investor interests in securities market.' },
            { date: '2026-01-04', category: 'Movement', priority: 'High', content: 'Non-Cooperation Movement launched by Gandhi in 1920 after Jallianwala Bagh massacre; aimed at self-governance through non-violent resistance.' },
            { date: '2026-01-04', category: 'Mountain', priority: 'Medium', content: 'Mount K2 (Godwin-Austen) is second highest peak in world at 8611m; located in Pakistan-occupied Kashmir on India-Pakistan border.' },
            { date: '2026-01-04', category: 'Sports', priority: 'Medium', content: 'Neeraj Chopra won India\'s first Olympic gold in athletics (Javelin Throw) at Tokyo 2020; also won World Championship gold in 2023.' }
        ]
    };

    if (specificDate) {
        return dailyData[specificDate] || [];
    }

    return Object.values(dailyData).flat();
};

module.exports = {getMockDailyDataDecember_January};
