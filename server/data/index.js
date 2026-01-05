//=====================================================
// DATA/INDEX.JS - Central Export for All Mock Data
// =====================================================

const { mockYearlyData } = require('./mockYearlyData');
const { mockMonthlyData } = require('./mockMonthlyData');
const { getMockDailyDataDecember2025 } = require('./mockDailyData');

module.exports = {
    mockYearlyData,
    mockMonthlyData,
    getMockDailyDataDecember2025
};
