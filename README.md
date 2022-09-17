# TriggerRemover ![logo](https://raw.githubusercontent.com/operatorequals/TriggerRemover/master/assets/images/icon48.png)

A Browser Addon/Extension that *removes* triggering content from pages based on words matching with Trigger Word lists.
Works both on *Firefox* and *Chrome* (and possibly others).

One can create personal lists of words to avoid or use preset lists available in the extension.

## When/Why to use this Extension

In case you are struggling and/or recovering from a mental condition or addiction
that is reinforced by [External](https://psychcentral.com/lib/what-is-a-trigger) or[Trauma triggers](https://psychcentral.com/health/trauma-triggers#examples).
Such conditions are:
* Addictions: Alcoholism, Drug Addictions
* Post-Traumatic Stress Disorder (PTSD)
* Eating Disorders (ED)

As these conditions can be fueled by triggers, facing one while off-guard (e.g: while casually browsing)
can cause stress, spiraling and thoughts of relapse.

There are several places that can serve triggering content without explicitly
searching for it (looking at you Youtube Related Videos), and these places have been targeted first by this Extension.

## Webpages currently filtered
* Youtube Search Results page (`/results`)
* Youtube Related Videos (`/watch`)
* ... more to come ...

## Usage

### Trigger Lists

One can create lists either manually or by importing custom lists. This repository also provides sample lists under [`trigger_lists/`](https://github.com/operatorequals/TriggerRemover/tree/master/trigger_lists) directory.

The `Preset Lists` shown in Extension's *Options Page* directly load the lists of the above directory.


#### Preset Lists

* Trigger Warning Phrases

Phrases that indicate that content can be triggering, such as `TW`, `Trigger Warning`.

* Eating Disorders

Words and phrases, as well as measurements that can have triggering effects on people with EDs.

##### ... a lot more missing ...

### Exposure Level

The Extension supports setting an `Exposure Level` (in the Extension's Popup). Changing the Exposure Level means
that there **will be possibility** to face some triggering content (if it was in the page in the first place).

This feature is there to aid with [Exposure Therapy](https://psychcentral.com/lib/what-is-exposure-therapy), where one can try to identify and control triggers
in order to achieve *desensitization*.

### Options page
![screenshot](https://raw.githubusercontent.com/operatorequals/TriggerRemover/master/img/screenshot-0-0-2.png)

## Contributing

The Preset Lists were created while researching and for the purpose of testing the Extension.
While they indeed block a lot of stuff, they might not be perfect.

To submit suggestions about Trigger Lists contents please open an Issue under [Repository Issues](https://github.com/operatorequals/TriggerRemover/issues) (creating a Github account is trivial).

Please, if you have one or more words you wish to be added to one of the lists, use *Base64 encoding* on them (easily done in this [website](https://www.base64encode.net/)), so they are not readable while randomly browsing the Issues, as Trigger Words might affect some people even in this context.

Issue Example:

```
title: [TriggerWord] Addition in ED list

issue:
I recently found that the word 'd2VpZ2h0IGxvc3M=' is very much encountered in Youtube Search Results, Comments and Google Results.

Even when looking for words like 'fitness'.
```


## --- Please Read! ---

This Web Extension might not be able to handle and properly hide *ALL* triggering content, as it is based on matching certain words and sequences in text. That means that, while it has been made with best intentions, it might not totally protect you from triggering.

If you are frequently triggered by content on the Internet or you find yourself actively looking for triggering content sometimes, it might be a good idea to seek therapy.

Stay strong...


## Donations
In case my work helped you, you can always buy me a beer or a liter of gas [through the Internet](https://www.buymeacoffee.com/operatorequals) or in case you meet me personally.
In the second case we can talk about mental conditions and how the way we grow up inherently fucks us up, or what goes on with parenting, or maybe [the Rat Park](https://en.wikipedia.org/wiki/Rat_Park) experiment, the duality of mind and body in "western" culture and anything you'll bring up :)

[![donation](https://cdn-images-1.medium.com/max/738/1*G95uyokAH4JC5Ppvx4LmoQ@2x.png)](https://www.buymeacoffee.com/operatorequals)

