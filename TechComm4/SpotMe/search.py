from django import forms
from SpotMe.models import Area

class AreaForm(forms.Form):
	seating = forms.IntegerField(label='Seating', default=False)
	whiteboards = forms.BooleanField(label='Whiteboards', default=False)
	outlets = forms.IntegerField(label='Outlets', default=False)
	tables = forms.IntegerField(label='Tables', default=False)