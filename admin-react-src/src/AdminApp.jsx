import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Slider } from './components/ui/slider';
import { Switch } from './components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Save, Loader2 } from 'lucide-react';

// Messenger icons using correct SVG files from assets/images/
const messengerIcons = {
  whatsapp: `${window.wpBmbPluginUrl}assets/images/whatsapp.svg`,
  telegram: `${window.wpBmbPluginUrl}assets/images/telegram.svg`,
  viber: `${window.wpBmbPluginUrl}assets/images/viber.svg`,
  messenger: `${window.wpBmbPluginUrl}assets/images/messenger.svg`,
  signal: `${window.wpBmbPluginUrl}assets/images/signal.svg`,
  wechat: `${window.wpBmbPluginUrl}assets/images/wechat.svg`,
  line: `${window.wpBmbPluginUrl}assets/images/line.svg`,
  discord: `${window.wpBmbPluginUrl}assets/images/discord.svg`,
  vk: `${window.wpBmbPluginUrl}assets/images/vk.svg`,
  max: `${window.wpBmbPluginUrl}assets/images/max.png`,
  comera: `${window.wpBmbPluginUrl}assets/images/comera.png`,
  botim: `${window.wpBmbPluginUrl}assets/images/botim.png`,
  imo: `${window.wpBmbPluginUrl}assets/images/imo.svg`,
};

const messengersConfig = [
  { type: 'whatsapp', name: 'WhatsApp', placeholder: 'Enter phone number', example: 'https://wa.me/79123456789', note: 'Enter a phone number. Works on all devices.' },
  { type: 'telegram', name: 'Telegram', placeholder: 'Enter @username or a link', example: 'https://t.me/username or tg://join?id=group_id', note: 'For personal chat use t.me/username; for groups use joinchat.' },
  { type: 'viber', name: 'Viber', placeholder: 'Enter phone number or a deep link', example: 'viber://chat?number=%2B79123456789', note: 'Deep links are for mobile; on desktop use https://chats.viber.com/username.' },
  { type: 'messenger', name: 'Facebook Messenger', placeholder: 'Enter username', example: 'https://m.me/username', note: 'Opens chat with page/username.' },
  { type: 'signal', name: 'Signal', placeholder: 'Enter phone number', example: 'https://signal.me/#p/+79123456789', note: 'For personal chat by phone number.' },
  { type: 'wechat', name: 'WeChat', placeholder: 'Enter WeChat ID', example: 'weixin://dl/chat?username', note: 'Requires a WeChat ID; deep links are for mobile.' },
  { type: 'line', name: 'LINE', placeholder: 'Enter LINE ID', example: 'https://line.me/R/ti/p/@username', note: 'For chat with @username.' },
  { type: 'discord', name: 'Discord', placeholder: 'Enter invite code', example: 'https://discord.com/invite/invitecode', note: 'For servers; personal chats are via invites.' },
  { type: 'vk', name: 'VK Messenger', placeholder: 'Enter VK ID', example: 'https://vk.com/im?sel=c1 or vk://chat?id=ID', note: 'Works with VK IDs; use VK API to build links if needed.' },
  { type: 'max', name: 'MAX', placeholder: 'Enter user ID or bot username', example: 'https://max.ru/your_bot or https://max.ru/your_bot?start=payload', note: 'For bots (recommended): the username typically ends with _bot or bot (e.g. support_bot).' },
  { type: 'comera', name: 'Comera', placeholder: 'Enter phone number or username', example: 'comera://chat?number=%2B79123456789', note: 'Use phone-number deep link where supported.' },
  { type: 'botim', name: 'Botim', placeholder: 'Enter phone number or username', example: 'botim://chat?number=%2B79123456789', note: 'Phone-based deep links for contacts.' },
  { type: 'imo', name: 'IMO', placeholder: 'Enter phone number or username', example: 'imo://chat?number=%2B79123456789', note: 'Use phone number deep link.' },
];

function App() {
  const [settings, setSettings] = useState({
    position: 'right-bottom',
    offset: 20,
    display_mode: 'everywhere',
    primary_color: '#6366f1',
    hover_color: '#4f46e5',
    icon_style: 'flat',
    icon_size: 56,
    enable_animation: true,
    show_text: false,
    enable_analytics: false,
    event_category: 'Messengers',
    custom_css: '',
    working_hours_enabled: false,
    working_hours_schedule: {},
    messengers: {},
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (window.wpBmbSettings) {
      setSettings(prev => ({ ...prev, ...window.wpBmbSettings }));
    }
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('action', 'bmb_save_settings');
      formData.append('nonce', window.wpBmbNonce);
      formData.append('options', JSON.stringify(settings));

      const response = await fetch(window.wpBmbAjaxUrl, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        alert('Settings saved successfully!');
      } else {
        alert('Error saving settings: ' + (data.data || 'Unknown error'));
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setSaving(false);
  };

  const updateMessenger = (type, field, value) => {
    setSettings(prev => ({
      ...prev,
      messengers: {
        ...prev.messengers,
        [type]: {
          ...prev.messengers[type],
          [field]: value,
        },
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold mb-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Messengers Buttons
              </h1>
              <p className="text-gray-600 text-sm">Messenger widget settings</p>
            </div>
            <button
              onClick={saveSettings}
              disabled={saving}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 h-auto rounded-md font-medium shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save changes
            </button>
          </div>
          <p className="text-gray-600 text-sm max-w-3xl">
            Add WhatsApp, Telegram, MAX, Viber, Signal and other messengers into one modern floating widget.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white border border-gray-200 p-1 h-auto shadow-sm rounded-lg">
            <TabsTrigger
              value="basic"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white px-6 py-2.5 rounded-md transition-all"
            >
              Basic settings
            </TabsTrigger>
            <TabsTrigger
              value="messengers"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white px-6 py-2.5 rounded-md transition-all"
            >
              Messengers
            </TabsTrigger>
            <TabsTrigger
              value="advanced"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white px-6 py-2.5 rounded-md transition-all"
            >
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Widget Position</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  <Select value={settings.position} onValueChange={(v) => setSettings({...settings, position: v})}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="right-bottom">Bottom Right</SelectItem>
                      <SelectItem value="left-bottom">Bottom Left</SelectItem>
                      <SelectItem value="right-top">Top Right</SelectItem>
                      <SelectItem value="left-top">Top Left</SelectItem>
                      <SelectItem value="center-bottom">Bottom Center</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Offset: {settings.offset}px
                  </label>
                  <Slider
                    value={[settings.offset]}
                    onValueChange={([v]) => setSettings({...settings, offset: v})}
                    min={0}
                    max={100}
                    step={5}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Display Mode</label>
                  <Select value={settings.display_mode} onValueChange={(v) => setSettings({...settings, display_mode: v})}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="everywhere">Everywhere</SelectItem>
                      <SelectItem value="mobile">Mobile Only</SelectItem>
                      <SelectItem value="desktop">Desktop Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                  <input
                    type="color"
                    value={settings.primary_color}
                    onChange={(e) => setSettings({...settings, primary_color: e.target.value})}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hover Color</label>
                  <input
                    type="color"
                    value={settings.hover_color}
                    onChange={(e) => setSettings({...settings, hover_color: e.target.value})}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icon Style</label>
                  <Select value={settings.icon_style} onValueChange={(v) => setSettings({...settings, icon_style: v})}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flat">Flat</SelectItem>
                      <SelectItem value="gradient">Gradient</SelectItem>
                      <SelectItem value="neon">Neon</SelectItem>
                      <SelectItem value="glassmorphism">Glassmorphism</SelectItem>
                      <SelectItem value="outline">Outline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Enable Animation</label>
                  <Switch
                    checked={settings.enable_animation}
                    onCheckedChange={(v) => setSettings({...settings, enable_animation: v})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Show Text Under Icons</label>
                  <Switch
                    checked={settings.show_text}
                    onCheckedChange={(v) => setSettings({...settings, show_text: v})}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="messengers" className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Configure Messengers</h2>
              <div className="grid gap-4">
                {messengersConfig.map((messenger) => (
                  <div key={messenger.type} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-4 mb-3">
                      <img
                        src={messengerIcons[messenger.type]}
                        alt={messenger.name}
                        className="w-10 h-10 object-contain"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{messenger.name}</h3>
                      </div>
                      <Switch
                        checked={settings.messengers[messenger.type]?.enabled || false}
                        onCheckedChange={(v) => updateMessenger(messenger.type, 'enabled', v)}
                      />
                    </div>
                    {settings.messengers[messenger.type]?.enabled && (
                      <div className="space-y-3 pl-14">
                        <input
                          type="text"
                          placeholder={messenger.placeholder}
                          value={settings.messengers[messenger.type]?.value || ''}
                          onChange={(e) => updateMessenger(messenger.type, 'value', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500">{messenger.note}</p>
                        <p className="text-xs text-gray-400">Example: {messenger.example}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Enable Analytics</label>
                  <Switch
                    checked={settings.enable_analytics}
                    onCheckedChange={(v) => setSettings({...settings, enable_analytics: v})}
                  />
                </div>
                {settings.enable_analytics && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Category</label>
                    <input
                      type="text"
                      value={settings.event_category}
                      onChange={(e) => setSettings({...settings, event_category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Custom CSS</h2>
              <textarea
                value={settings.custom_css}
                onChange={(e) => setSettings({...settings, custom_css: e.target.value})}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="/* Enter your custom CSS here */"
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Working Hours</h2>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-700">Enable Working Hours</label>
                <Switch
                  checked={settings.working_hours_enabled}
                  onCheckedChange={(v) => setSettings({...settings, working_hours_enabled: v})}
                />
              </div>
              <p className="text-sm text-gray-500">Widget will only show during configured business hours.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
