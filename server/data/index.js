//=====================================================
// DATA/INDEX.JS - Central Export for All Mock Data
// =====================================================

const { mockYearlyData } = require('./mockYearlyData');
const { mockMonthlyData } = require('./mockMonthlyData');
const { getMockDailyDataDecember_January } = require('./mockDailyData');

module.exports = {
    mockYearlyData,
    mockMonthlyData,
    getMockDailyDataDecember_January
};
