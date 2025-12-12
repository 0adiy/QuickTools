# QuickTools
## About
QuickTools is a chromium based browser extension that helps developers become power users.

Using minimal bundling tricks, and primarily uses vanilla HTML, CSS and JS so easy to understand and hack, you are highly encouraged to modify and add features that you need.

It is designed to be used primarily as developer extension and requests all sorts of permissions due to inherent trust on developer being you.
It also doesn't stop you from doing silly things like opening 10,000 links at once

## Features
- Group tabs using origin of website (e.g. all amazon links goes into one group)
- Reload all tabs
- Textbox that holds URLs (supports commenting)
- Open all links in textbox at once
- Grab all links for every tab in the window (with titles if verbose is on) into textbox
- Extract all links from a selected element into textbox
- Includes one time custom scripts like **Enable selection of text**, **Enable context menu**, **Enable content editable** (whole page can be edited just by selection),  and **Clear cookies**. *You are encouraged to add more scripts here*

## Installation
1. Clone this repo
```sh
git clone https://github.com/0adiy/QuickTools
```

2. Open Edge (or any Chromium based browser) and go to manage extensions page (URL in edge is `edge://extensions/`)
and turn on developer mode

3. Click on "Load unpacked" button and select the folder containing the `manifest.json` (i.e. inside the cloned repo)

4. Ensure you reload tabs before trying out all features as some scripts are not loaded into old pages

## Contributing
Contributions are accepted if the feature you provide follows GitHub Community Guidelines and Guidelines of Browser extension marketplaces (and also common sense).

## Quick Links
- [GitHub Community Guidelines](https://docs.github.com/en/site-policy/github-terms/github-community-guidelines)
- [Chrome Extensions Developer Reference](https://developer.chrome.com/docs/extensions/reference)
- [Edge Extensions Developer Reference](https://learn.microsoft.com/en-us/microsoft-edge/developer/)