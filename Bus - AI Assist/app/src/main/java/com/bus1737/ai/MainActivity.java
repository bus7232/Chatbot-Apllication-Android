package com.bus1737.ai;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;
import com.bus1737.ai.databinding.ActivityMainBinding;

public class MainActivity extends AppCompatActivity {

    private ActivityMainBinding binding;
    private WebView webView; 

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        // Initialize WebView
        webView = binding.webView; // Assuming you've added a WebView named 'webView' in your layout

        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true); // Enable JavaScript for interactivity
        webSettings.setDomStorageEnabled(true); // Allow for localStorage (if needed)

        // Prevent the app from launching an external browser for links
        webView.setWebViewClient(new WebViewClient());  

        // Load your index.html from the assets folder
        webView.loadUrl("file:///android_asset/index.html");
    }

    // Handle back button press within WebView
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        binding = null;
    }
}
