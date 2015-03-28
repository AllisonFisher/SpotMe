from django import forms
from SpotMe.models import Area

class AreaForm(forms.Form):
	
	# other parts of the program assume these are all integer field
	# ask Zach before changing anything from IntegerFields
	seating = forms.IntegerField(label='Seating', required = False)
	whiteboards = forms.IntegerField(label='Whiteboards', required = False)
	outlets = forms.IntegerField(label='Outlets', required = False)
	tables = forms.IntegerField(label='Tables', required = False)