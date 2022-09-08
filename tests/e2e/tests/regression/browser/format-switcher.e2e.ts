import { keyLength, rte } from '../../../helpers/constants';
import { addKeysViaCli, deleteKeysViaCli, keyTypes } from '../../../helpers/keys';
import { acceptLicenseTerms, acceptLicenseTermsAndAddDatabaseApi } from '../../../helpers/database';
import { BrowserPage, MyRedisDatabasePage } from '../../../pageObjects';
import { commonUrl, ossStandaloneConfig } from '../../../helpers/conf';
import { addNewStandaloneDatabasesApi, deleteStandaloneDatabaseApi, deleteStandaloneDatabasesApi } from '../../../helpers/api/api-database';
import { Common } from '../../../helpers/common';

const browserPage = new BrowserPage();
const common = new Common();
const myRedisDatabasePage = new MyRedisDatabasePage();

const keysData = keyTypes.map(object => ({ ...object }));
keysData.forEach(key => key.keyName = `${key.keyName}` + '-' + `${common.generateWord(keyLength)}`);
const databasesForAdding = [
    { host: ossStandaloneConfig.host, port: ossStandaloneConfig.port, databaseName: 'testDB1' },
    { host: ossStandaloneConfig.host, port: ossStandaloneConfig.port, databaseName: 'testDB2' }
];

fixture `Format switcher functionality`
    .meta({
        type: 'regression',
        rte: rte.standalone
    })
    .page(commonUrl)
    .beforeEach(async() => {
        await acceptLicenseTermsAndAddDatabaseApi(ossStandaloneConfig, ossStandaloneConfig.databaseName);
        // Create new keys
        await addKeysViaCli(keysData);
    })
    .afterEach(async() => {
        // Clear keys and database
        await deleteKeysViaCli(keysData);
        await deleteStandaloneDatabaseApi(ossStandaloneConfig);
    });
test
    .before(async() => {
        // Add new databases using API
        await acceptLicenseTerms();
        await addNewStandaloneDatabasesApi(databasesForAdding);
        // Create new keys
        await addKeysViaCli(keysData);
        // Reload Page
        await common.reloadPage();
        await myRedisDatabasePage.clickOnDBByName(databasesForAdding[0].databaseName);
    })
    .after(async() => {
        // Clear keys and database
        await deleteKeysViaCli(keysData);
        await deleteStandaloneDatabasesApi(databasesForAdding);
    })('Formatters saved selection', async t => {
        // Open key details and select JSON formatter
        await browserPage.openKeyDetails(keysData[0].keyName);
        await browserPage.selectFormatter('JSON');
        // Reopen key details
        await t.click(browserPage.closeKeyButton);
        await browserPage.openKeyDetailsByKeyName(keysData[0].keyName);
        // Verify that formatters selection is saved when user switches between keys
        await t.expect(browserPage.formatSwitcher.withExactText('JSON').visible).ok('Formatter value is not saved');
        // Verify that formatters selection is saved when user reloads the page
        await common.reloadPage();
        await t.expect(browserPage.formatSwitcher.withExactText('JSON').visible).ok('Formatter value is not saved');
        // Go to another database
        await t.click(myRedisDatabasePage.myRedisDBButton);
        await myRedisDatabasePage.clickOnDBByName(databasesForAdding[1].databaseName);
        // Verify that formatters selection is saved when user switches between databases
        await t.expect(browserPage.formatSwitcher.withExactText('JSON').visible).ok('Formatter value is not saved');
    });
test('Verify that user don`t see format switcher for JSON, GRAPH, TS keys', async t => {
    // Create array with JSON, GRAPH, TS keys
    const keysWithoutSwitcher = [keysData[5], keysData[7], keysData[8]];
    for (let i = 0; i < keysWithoutSwitcher.length; i++) {
        await browserPage.openKeyDetailsByKeyName(keysWithoutSwitcher[i].keyName);
        // Verify that format switcher is not displayed
        await t.expect(browserPage.formatSwitcher.visible).notOk(`Formatter is displayed for ${keysWithoutSwitcher[i].textType} type`, { timeout: 1000 });
    }
});
test('Verify that user can see switcher icon for narrow screen and tooltip by hovering', async t => {
    await browserPage.openKeyDetails(keysData[0].keyName);
    await browserPage.selectFormatter('JSON');
    // Verify icon is not displayed with high screen resolution
    await t.expect(browserPage.formatSwitcherIcon.visible).notOk('Format switcher Icon is displayed with high screen resolution');
    // Minimize the window to check icon
    await t.resizeWindow(1500, 900);
    // Verify icon is displayed with low screen resolution
    await t.expect(browserPage.formatSwitcherIcon.visible).ok('Format switcher Icon is not displayed with low screen resolution');
    await t.hover(browserPage.formatSwitcher);
    // Verify tooltip is displayed on hover with low screen resolution
    await t.expect(browserPage.tooltip.textContent).contains('JSON', 'Selected formatter is not displayed in tooltip');
});
