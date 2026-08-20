package labstacknetworks

import (
	"fmt"
	"net/url"
)

// toQuery converts a loosely-typed params map into url.Values, skipping nil
// entries and empty strings. Used for endpoints with many optional query
// parameters where a typed signature would be unwieldy.
func toQuery(params map[string]any) url.Values {
	values := url.Values{}
	for key, value := range params {
		if value == nil {
			continue
		}
		if s, ok := value.(string); ok && s == "" {
			continue
		}
		values.Set(key, fmt.Sprintf("%v", value))
	}
	return values
}
