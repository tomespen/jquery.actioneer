# jquery.actioneer
Simple action launcer made for Efi's customerservice intranet.
The launcher was inspired by [Launcy](http://www.launchy.net/) and [Alfred](http://www.alfredapp.com/) and bears resemblance to these applications.

Big thank you to [Efi](http://www.efi.no) which allowed me to Open Source the code, which was developed on their time.

Homepage and live example soon...

##Configuration
Is done through JSON, see the included document.json for an example.
The "jsonActions" option takes a JSON blob, reference to a .json file or it can be left blank.
If it is left blank the plugin will look for links with the class "actioneer" and build it's actions list from these.

`$('body').actioneer(
		{
			keyTrigger: 'shift+space',
			jsonActions: 'document.json'
		}
	);`

Currently there are callbacks for pluginCreation (created), init (init) and Action building complete (buildComplete).
More will be added.


###Todo
* Improve code quality
* Versatility, improve configuration options
* "Feeling" when interacting with the search box
* more to come..

###Dependencies
* jQuery 2.x+
* jQuery UI 1.9.x+
* jQuery UI widget factory
* jQuery hotkeys

###Browser compatability
* IE 7 and greater
* FireFox, tested on version 25
* Chrome, tested on version 30+
* Safari, tested on 7
* Should work everywhere jQuery 2.x works