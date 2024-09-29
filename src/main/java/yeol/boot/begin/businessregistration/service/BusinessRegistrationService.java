package yeol.boot.begin.businessregistration.service;

import okhttp3.*;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;

@Service
public class BusinessRegistrationService {
    private final OkHttpClient client = new OkHttpClient();
    private final String serviceKey = "E2urls6jrskp01pYCG9MLhLmfG+zkO2NFpPEEmpVwMFdWXbtsL9EpddKW/5T2EVai3gtF13ipqCZBzzCHsMgTQ==";

    public String getBusinessStatus(List<String> businessNumbers) throws Exception {
        String url = "https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey="
                + URLEncoder.encode(serviceKey, StandardCharsets.UTF_8);

        String json = new Gson().toJson(Map.of("b_no", businessNumbers));
        RequestBody body = RequestBody.create(json, MediaType.get("application/json; charset=utf-8"));
        Request request = new Request.Builder().url(url).post(body).build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Unexpected code " + response);
            }
            return response.body().string();
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception("API 호출 중 오류 발생", e);
        }
    }
}
