# jquery.actioneer
Simple action launcer made for Efi's customerservice intranet.
The launcher was inspired by [Launcy](http://www.launchy.net/) and [Alfred](http://www.alfredapp.com/) and bears resemblance to these applications.

Big thank you to [Efi](http://www.efi.no) which allowed me to Open Source the code, which was developed on their time.

Homepage and live example coming soon...

##Configuration
Is done through JSON, see the included document.json for an example.
The "jsonActions" option takes a JSON blob, reference to a .json file or it can be left blank.
If it is left blank the plugin will look for links with the class "actioneer" and build it's actions list from these.

	$('body').actioneer(
		{
			keyTrigger: 'shift+space',
			jsonActions: 'document.json'
		}
	);

Currently there are callbacks for pluginCreation (created), init (init) and Action building complete (buildComplete).
More will be added.


###Todo
* Improve code quality
* Versatility, improve configuration options
* "Feeling" when interacting with the search box
* more to come..

###Dependencies
* [jQuery 2.x+](http://jquery.com/)
* [jQuery UI 1.9.x+](http://jqueryui.com/)
* [jQuery UI widget factory](http://jqueryui.com/)
* [jQuery hotkeys](https://github.com/jeresig/jquery.hotkeys)

###Browser compatability
* IE 7 and greater
* FireFox, tested on version 25
* Chrome, tested on version 30+
* Safari, tested on 7
* Should work everywhere jQuery 2.x works

####Licence - MIT 
	Copyright (c) 2014 Tom Espen Pedersen / tom.espen.pedersen@gmail.com
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.