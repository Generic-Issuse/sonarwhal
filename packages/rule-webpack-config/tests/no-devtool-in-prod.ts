import * as path from 'path';
import * as mock from 'mock-require';

import * as ruleRunner from 'sonarwhal/dist/tests/helpers/rule-runner';
import { RuleLocalTest } from 'sonarwhal/dist/tests/helpers/rule-test-type';

// We need to use `require` to be able to overwrite the method `getPackage`.
const misc = require('sonarwhal/dist/src/lib/utils/misc');
const webpackDestPath = path.join(__dirname, 'fixtures', 'valid', 'package.json');
const webpackConfig = misc.loadJSONFile(webpackDestPath);
const originalGetPackage = misc.getPackage;

const ruleName = 'webpack-config/no-devtool-in-prod';
const tests: Array<RuleLocalTest> = [
    {
        after() {
            misc.getPackage = originalGetPackage;
        },
        before() {
            misc.getPackage = () => {
                return webpackConfig;
            };

            mock('sonarwhal/dist/src/lib/utils/misc', misc);
        },
        name: 'If no devtool in configuration, it should pass',
        path: path.join(__dirname, 'fixtures', 'valid')
    },
    {
        after() {
            misc.getPackage = originalGetPackage;
        },
        before() {
            misc.getPackage = () => {
                return webpackConfig;
            };

            mock('sonarwhal/dist/src/lib/utils/misc', misc);
        },
        name: 'If devtool has a value different than `eval`, it should pass',
        path: path.join(__dirname, 'fixtures', 'noeval')
    },
    {
        after() {
            misc.getPackage = originalGetPackage;
        },
        before() {
            misc.getPackage = () => {
                return webpackConfig;
            };

            mock('sonarwhal/dist/src/lib/utils/misc', misc);
        },
        name: 'If devtool is set to `eval` should fail',
        path: path.join(__dirname, 'fixtures', 'eval'),
        reports: [{ message: '`eval` not recommended for prodution' }]
    }
];

ruleRunner.testLocalRule(ruleName, tests, {
    parsers: ['webpack-config'],
    serial: true
});
