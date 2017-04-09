export default class Reporter {

  constructor() {
    this.actual = 0;
    this.expected = 0;
    this.success = true;

    this.numberOfFiles = 0;
    this.notCoveredFiles = 0;
  }

  // eslint-disable-next-line no-unused-vars
  report(filename, success, actual, expected, uncoveredLines) {
    this.numberOfFiles++;
    this.actual += actual;
    this.expected += expected;

    if (!success) {
      this.success = false;
      this.notCoveredFiles++;
    }
  }

  finish() {}

}
