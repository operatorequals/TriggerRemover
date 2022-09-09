# Firefox Personalized Alarms Add-on Tutorial

Code repository for a SitePoint tutorial on how to create a Firefox add-on.

The finished add-on allows the user to create reocurring alarms, triggered at specified times with custom text. 

It can be installed from the [Firefox Browser Add-ons page](https://addons.mozilla.org/en-US/firefox/addon/personalized-alarms/)

## Installing as a Temporary Add-On

1. Clone repo
2. Include the following in `manifest.json`:
   ```json
   "browser_specific_settings": {
     "gecko": {
       "id": "addon@example.com",
       "strict_min_version": "42.0"
     }
   }
   ```
   _Make sure to remove it once you're ready to publish the package_
3. Open Firefox, then choose _Add-ons and Themes_ from the menu, or using the shortcut <kbd>CTRL</kbd> + <kbd>SHIFT</kbd> + <kbd>A</kbd> 
4. Click on the _Settings_ icon next to _Manage Your Extensions_ and choose _Debug Add-ons_
5. Click on _Load Temporary Add-on_ and choose the `manifest.json` file from the cloned repo
6. If everything was done correctly, you should see the following:
   ![Personalized Alarms Add-on](https://uploads.sitepoint.com/wp-content/uploads/2021/05/1621350248s_ED818300CF5E841672F2C3FF9866554D5DA217143A51AE9342F11F975CA32D8E_1621239120552_Screenshotfrom2021-05-1710-44-41.jpg)

## License

SitePoint's code archives and code examples are licensed under the MIT license.

Copyright © 2021 SitePoint

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
