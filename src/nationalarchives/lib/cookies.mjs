/**
 * Class to handle cookies.
 * @class Cookies
 * @constructor
 * @public
 */
export default class Cookies {
  /** @protected */
  extraPolicies = [];
  /** @protected */
  domain = "";
  /** @protected */
  secure = true;
  /** @protected */
  events = {};
  /** @protected */
  policiesKey = "";

  /**
   * Create a cookie handler.
   * @param {string[]} [extraPolicies=[]] - The extra cookie policies to manage in addition to essential, settings and usage.
   * @param {string} [options.domain=""] - The domain to register the cookie with.
   * @param {string} [options.secure=true] - Only set cookie in HTTPS environments.
   * @param {string} [options.policiesKey=cookies_policy] - The name of the cookie.
   */
  constructor(extraPolicies = [], options = {}) {
    const {
      domain = "",
      secure = true,
      policiesKey = "cookies_policy",
    } = options;
    if (Cookies._instance && Cookies._instance.policiesKey === policiesKey) {
      return Cookies._instance;
    }
    Cookies._instance = this;
    this.extraPolicies = extraPolicies;
    this.domain = domain;
    this.secure = secure;
    this.events = {};
    this.policiesKey = policiesKey;
    this.init();
  }

  /** @protected */
  init() {
    this.savePolicies({
      ...Object.fromEntries(
        this.extraPolicies.map((k) => [k.toLowerCase(), false]),
      ),
      usage: false,
      settings: false,
      ...this.policies,
      essential: true,
    });
  }

  destroy() {
    Cookies._instance = null;
    this.trigger("destroy");
  }

  get all() {
    const deserialised = {};
    document.cookie
      .split(";")
      .filter((x) => x)
      .forEach((cookie) => {
        const parts = cookie.trim().split("=");
        if (parts[0]) {
          deserialised[parts[0]] = parts[1];
        }
      });
    return deserialised;
  }

  get policies() {
    return JSON.parse(this.get(this.policiesKey) || "{}");
  }

  /**
   * Check to see whether a cookie exists or not.
   * @param {string} key - The cookie name.
   * @returns {boolean}
   */
  exists(key) {
    return Object.prototype.hasOwnProperty.call(this.all, key);
  }

  /**
   * Check to see whether a cookie has a particular value.
   * @param {string} key - The cookie name.
   * @param {string|number|boolean} value - The value to check against.
   * @returns
   */
  hasValue(key, value) {
    return this.get(key) == value;
  }

  /**
   * Get a cookie.
   * @param {string} key - The cookie name.
   * @returns {string|number|boolean}
   */
  get(key) {
    return this.exists(key) ? decodeURIComponent(this.all[key]) : null;
  }

  /**
   * Set a cookie.
   * @param {string} key - The cookie name.
   * @param {string|number|boolean} value - The cookie value.
   * @param {Object} options
   * @param {number} [options.maxAge=31536000] - The maximum age of the cookie in seconds.
   * @param {string} [options.path=/] - The path to register the cookie for.
   * @param {string} [options.sameSite=Lax] - The sameSite attribute.
   * @param {string} [options.domain=this.domain] - The domain to register the cookie with.
   * @param {string} [options.secure=this.secure] - Only set cookie in HTTPS environments.
   */
  set(key, value, options = {}) {
    const {
      maxAge = 60 * 60 * 24 * 365,
      path = "/",
      sameSite = "Lax",
      domain = this.domain,
      secure = this.secure,
    } = options;
    if (!key) {
      return;
    }
    const cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)};${
      domain ? ` domain=${domain};` : ""
    } samesite=${sameSite}; path=${path}; max-age=${maxAge}${
      secure ? "; secure" : ""
    }`;
    document.cookie = cookie;
    this.trigger("setCookie", {
      key,
      value,
      maxAge,
      path,
      sameSite,
      domain,
      secure,
      cookie,
    });
  }

  /**
   * Delete a cookie.
   * @param {string} key - The cookie name.
   * @param {string} [path=/] - The path to the cookie is registered on.
   */
  delete(key, path = "/", domain = null) {
    const options = { maxAge: -1, path, domain: domain || undefined };
    this.set(key, "", options);
    this.trigger("deleteCookie", { key, ...options });
  }

  /**
   * Delete all cookies.
   */
  deleteAll(path = "/", domain = null) {
    Object.keys(this.all).forEach((cookie) =>
      this.delete(cookie, path, domain),
    );
    this.trigger("deleteAllCookies", { path, domain });
  }

  /**
   * Accept a policy.
   * @param {string} policy - The name of the policy.
   */
  acceptPolicy(policy) {
    this.setPolicy(policy, true);
    this.trigger("acceptPolicy", policy);
    this.trigger("changePolicy", { [policy]: true });
  }

  /**
   * Reject a policy.
   * @param {string} policy - The name of the policy.
   */
  rejectPolicy(policy) {
    this.setPolicy(policy, false);
    this.trigger("rejectPolicy", policy);
    this.trigger("changePolicy", { [policy]: false });
  }

  /**
   * Set a policy.
   * @param {string} policy - The name of the policy.
   * @param {boolean} accepted - Whether the policy is accepted or not.
   */
  setPolicy(policy, accepted) {
    if (policy === "essential") {
      return;
    }
    this.savePolicies({
      ...this.policies,
      [policy]: accepted,
      essential: true,
    });
    this.trigger("changePolicy", { [policy]: accepted });
  }

  /**
   * Accept all the cookie policies.
   */
  acceptAllPolicies() {
    const allPolicies = Object.fromEntries(
      Object.keys(this.policies).map((k) => [k.toLowerCase(), true]),
    );
    this.savePolicies(allPolicies);
    this.trigger("acceptAllPolicies");
    this.trigger("changePolicy", allPolicies);
  }

  /**
   * Reject all the cookie policies.
   */
  rejectAllPolicies() {
    const allPolicies = {
      ...Object.fromEntries(
        Object.keys(this.policies).map((k) => [k.toLowerCase(), false]),
      ),
      essential: true,
    };
    this.savePolicies(allPolicies);
    this.trigger("rejectAllPolicies");
    this.trigger("changePolicy", allPolicies);
  }

  /**
   * Commit policy preferences to the browser.
   * @param {object} policies - The policies to commit.
   */
  savePolicies(policies) {
    this.set(this.policiesKey, JSON.stringify(policies));
  }

  /**
   * Get the acceptance status of a policy.
   * @param {string} policy - The name of the policy.
   * @returns {boolean}
   */
  isPolicyAccepted(policy) {
    return Object.prototype.hasOwnProperty.call(this.policies, policy)
      ? this.policies[policy] === true
      : null;
  }

  /**
   * Accept a policy.
   * @param {string} event - The event to add a listener for.
   * @param {function} callback - The callback function to call when the event is triggered.
   */
  on(event, callback) {
    if (!Object.prototype.hasOwnProperty.call(this.events, event)) {
      this.events[event] = [];
    }
    this.events[event] = [...this.events[event], callback];
  }

  /** @protected */
  trigger(event, data = {}) {
    if (Object.prototype.hasOwnProperty.call(this.events, event)) {
      this.events[event].forEach((eventToTrigger) =>
        eventToTrigger.call(this, data),
      );
    }
  }
}
