# TriggerRemover ![logo](https://raw.githubusercontent.com/operatorequals/TriggerRemover/master/assets/images/icon48.png)

A Browser Addon/Extension that removes triggering content from pages based on Trigger Word lists.
Works both on Firefox and Chrome (and possibly others) using Mozilla's [`webextension-polyfill`](https://github.com/mozilla/webextension-polyfill) library.

Based on the [Alarm Tutorial](https://addons.mozilla.org/en-US/firefox/addon/personalized-alarms/) as it is my first WebExtension.

## Usage

![screenshot](https://raw.githubusercontent.com/operatorequals/TriggerRemover/master/img/screenshot-0-0-1.png)


## Webpages currently filtered
* Youtube Search Results page (`/results`)
* Youtube Related Videos (`/watch`)


### Trigger Lists

One can create lists either manually (`Add Trigger Word`) or by importing custom lists. This repository also provides sample lists under [`trigger_lists/`](https://github.com/operatorequals/TriggerRemover/tree/master/trigger_lists) directory.

To import a list from the repository just click on the list file (don't worry the trigger words are always **not** readable) and then the `Raw` button just above and to the right of the file's contents. Then copy the URL and use it under `Import from file or URL`.


#### Premade Trigger Lists

I created some lists while testing the Addon. Keep in mind that while they indeed block a lot of stuff, they might not be perfect. If you have any suggestions, please see `Contributing` section below.

* EDs - `https://raw.githubusercontent.com/operatorequals/TriggerRemover/master/trigger_lists/ed.triggers.json`


##### ... a lot more missing ...


## Contributing

To submit suggestions about Trigger List contents please open an Issue under [Repository Issues](https://github.com/operatorequals/TriggerRemover/issues) (creating a Github account is trivial).

Please, if you have one or more words you wish to be added to one of the lists, use Base64 encoding on them (easily done in this [website](https://www.base64encode.net/)), so they are not readable while randomly browsing the Issues, as Trigger Words might affect some people even in this context.

Issue Example:

```
title: [TriggerWord] Addition in ED list

issue:
I recently found that the word 'd2VpZ2h0IGxvc3M=' is very much encountered in Youtube Search Results, Comments and Google Results.

Even when looking for words like 'fitness'.
```



## Please Read!

This Web Extension might not be able to handle and properly hide *ALL* triggering content, as it is based on matching certain words and sequences in text. That means that, while it has been made with best intentions, it might not totally protect you from triggering.

If you are frequently triggered by content on the Internet or you find yourself actively looking for triggering content sometimes, it might be a good idea to seek therapy.

Stay strong...