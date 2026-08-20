package in.labstack.sdk;

import java.util.LinkedHashMap;
import java.util.Map;

/** Small fluent builder for query/body maps that skips null values. */
public final class Params {
    private final Map<String, Object> map = new LinkedHashMap<>();

    public static Params of() {
        return new Params();
    }

    public Params put(String key, Object value) {
        if (value != null) {
            map.put(key, value);
        }
        return this;
    }

    public Map<String, Object> build() {
        return map;
    }
}
