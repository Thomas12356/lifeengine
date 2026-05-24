



def has_custom_value(value):
    """
    
    This function is used in event_services when checking for custom parameters
    If an event has not had a custom value defined for a field it is passed to the API as either:
    undefined or an empty string
    
    """
    if value is None:
        return False
    
    if isinstance(value, str) and value.strip() == "":
        return False
    
    return True

def clean_parameters(params):

    """
    This function takes in a set of parameters from a add event request payload
    and cleans the values.

    If a custom value has not been defined the field is replace with None.
    Otherwise the value is passed through.
    
    """

    if params is None:
        return {}
    
    if not isinstance(params, dict):
        raise ValueError("parameters must be a dict object")
    
    cleaned = {}

    for param, value in params.items():
        if has_custom_value(value):
            cleaned[param] = value
        else:
            cleaned[param] = None

    return cleaned