import { useState } from 'react';
import { Settings, Shield, AlertTriangle, Zap, Users, Key, RefreshCw, Bell } from 'lucide-react';

function Section({ title, icon: Icon, children, accent = '#06B6D4' }: {
  title: string; icon: React.ElementType; children: React.ReactNode; accent?: string;
}) {
  return (
    <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-[#08090C]">
        <div className="w-[3px] h-4 rounded-full" style={{ background: accent }} />
        <Icon className="w-4 h-4" style={{ color: accent }} />
        <span className="text-[13px] font-semibold text-white/85">{title}</span>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-white/70">{label}</p>
        {description && <p className="text-[11px] text-white/25 mt-0.5 leading-relaxed">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className={`relative w-10 h-5 rounded-full transition-colors ${on ? 'bg-[#10B981]' : 'bg-white/10'}`}>
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

function NumberInput({ value, onChange, min, max, suffix }: { value: number; onChange: (v: number) => void; min: number; max: number; suffix?: string }) {
  return (
    <div className="flex items-center gap-2">
      <input type="number" value={value} min={min} max={max} onChange={e => onChange(Number(e.target.value))}
        className="w-20 px-2.5 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded text-[12px] text-white/70 text-right focus:outline-none focus:border-[#06B6D4]/30 transition-colors" />
      {suffix && <span className="text-[11px] text-white/25">{suffix}</span>}
    </div>
  );
}

function SelectInput({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded text-[12px] text-white/70 focus:outline-none focus:border-[#06B6D4]/30 transition-colors appearance-none">
      {options.map(o => <option key={o} value={o} style={{ background: '#0E0F12' }}>{o}</option>)}
    </select>
  );
}

export default function RocksteadySettings() {
  const [alertThresholds, setAlertThresholds] = useState({ critical: 90, high: 75, medium: 60 });
  const [scanFrequency, setScanFrequency] = useState('15');
  const [aiRefresh, setAiRefresh] = useState(60);
  const [autoFlagScore, setAutoFlagScore] = useState(85);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [slackAlerts, setSlackAlerts] = useState(true);
  const [autoSign, setAutoSign] = useState(false);
  const [scoutNotifs, setScoutNotifs] = useState(true);
  const [teamMembers] = useState([
    { name: 'Randy Jackson', role: 'Executive', access: 'Full Access' },
    { name: 'Paula Moore',   role: 'A&R Director', access: 'Full Access' },
    { name: 'Jordan M.',     role: 'Senior Scout', access: 'Scout + View' },
    { name: 'Kai R.',        role: 'EU Scout', access: 'Scout + View' },
    { name: 'Priya T.',      role: 'SE Scout', access: 'Scout + View' },
  ]);

  return (
    <div className="min-h-full bg-[#07080A] p-5 space-y-5">

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
          <Settings className="w-5 h-5 text-white/50" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-white">Rocksteady Settings</h1>
          <p className="text-[11px] text-white/25">Configure intelligence thresholds, scout parameters, and system behavior</p>
        </div>
      </div>

      <Section title="Alert Thresholds" icon={Bell} accent="#EF4444">
        <SettingRow label="Critical Alert Threshold" description="Velocity score required to trigger a critical-level alert and notification.">
          <NumberInput value={alertThresholds.critical} onChange={v => setAlertThresholds(p => ({ ...p, critical: v }))} min={50} max={100} suffix="/ 100" />
        </SettingRow>
        <div className="h-[1px] bg-white/[0.04]" />
        <SettingRow label="High Alert Threshold" description="Velocity score required to trigger a high-level alert.">
          <NumberInput value={alertThresholds.high} onChange={v => setAlertThresholds(p => ({ ...p, high: v }))} min={40} max={95} suffix="/ 100" />
        </SettingRow>
        <div className="h-[1px] bg-white/[0.04]" />
        <SettingRow label="Medium Alert Threshold" description="Minimum score to surface in medium-level signal feed.">
          <NumberInput value={alertThresholds.medium} onChange={v => setAlertThresholds(p => ({ ...p, medium: v }))} min={30} max={90} suffix="/ 100" />
        </SettingRow>
        <div className="h-[1px] bg-white/[0.04]" />
        <SettingRow label="Email Notifications" description="Receive critical alerts via email.">
          <Toggle on={emailAlerts} onChange={() => setEmailAlerts(p => !p)} />
        </SettingRow>
        <SettingRow label="SMS Alerts" description="Receive urgent alerts via SMS for critical signals only.">
          <Toggle on={smsAlerts} onChange={() => setSmsAlerts(p => !p)} />
        </SettingRow>
        <SettingRow label="Slack Integration" description="Post breaking signals to team Slack channel.">
          <Toggle on={slackAlerts} onChange={() => setSlackAlerts(p => !p)} />
        </SettingRow>
      </Section>

      <Section title="Scout Scan Frequency" icon={RefreshCw} accent="#10B981">
        <SettingRow label="Platform Scan Interval" description="How often Rocksteady scans streaming and social platforms for signal changes.">
          <SelectInput value={scanFrequency} options={['5', '10', '15', '30', '60']} onChange={setScanFrequency} />
        </SettingRow>
        <div className="h-[1px] bg-white/[0.04]" />
        <SettingRow label="Scout Report Reminder" description="Notify scouts with pending reports after this many hours.">
          <NumberInput value={8} onChange={() => {}} min={1} max={24} suffix="hours" />
        </SettingRow>
        <div className="h-[1px] bg-white/[0.04]" />
        <SettingRow label="Scout Confirmation Notifications" description="Alert team when a scout confirms or upgrades an artist signal.">
          <Toggle on={scoutNotifs} onChange={() => setScoutNotifs(p => !p)} />
        </SettingRow>
      </Section>

      <Section title="AI Intelligence Settings" icon={Zap} accent="#F59E0B">
        <SettingRow label="AI Insight Refresh Interval" description="How frequently the AI scoring model re-scores monitored artists.">
          <NumberInput value={aiRefresh} onChange={setAiRefresh} min={15} max={240} suffix="min" />
        </SettingRow>
        <div className="h-[1px] bg-white/[0.04]" />
        <SettingRow label="Auto-Flag Score Threshold" description="Artists scoring above this threshold are automatically surfaced for team review.">
          <NumberInput value={autoFlagScore} onChange={setAutoFlagScore} min={50} max={100} suffix="/ 100" />
        </SettingRow>
        <div className="h-[1px] bg-white/[0.04]" />
        <SettingRow label="Auto-SIGN Recommendation" description="Allow AI to autonomously escalate to SIGN recommendation. Disabled by default.">
          <Toggle on={autoSign} onChange={() => setAutoSign(p => !p)} />
        </SettingRow>
      </Section>

      <Section title="Team Access" icon={Users} accent="#06B6D4">
        <div className="space-y-2">
          {teamMembers.map(member => (
            <div key={member.name} className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/[0.025] border border-white/[0.05]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/[0.08] flex items-center justify-center text-[10px] font-bold text-white/40 shrink-0">
                {member.name.split(' ').map(n => n.charAt(0)).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-white/75">{member.name}</p>
                <p className="text-[10px] text-white/30">{member.role}</p>
              </div>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                member.access === 'Full Access' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' : 'bg-white/5 text-white/35 border-white/10'
              }`}>{member.access}</span>
            </div>
          ))}
        </div>
        <button className="w-full py-2.5 rounded-xl border border-dashed border-white/[0.08] text-[11px] text-white/25 hover:text-white/45 hover:border-white/[0.12] transition-all">
          + Invite Team Member
        </button>
      </Section>

      <Section title="API Access" icon={Key} accent="#06B6D4">
        <SettingRow label="Rocksteady API Status" description="Live data access for third-party integrations and internal tooling.">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span className="text-[11px] font-mono text-[#10B981]/70">Active</span>
          </div>
        </SettingRow>
        <div className="h-[1px] bg-white/[0.04]" />
        <SettingRow label="API Key" description="Use this key for Rocksteady data integrations.">
          <div className="flex items-center gap-2">
            <code className="text-[11px] font-mono text-white/30 bg-white/[0.04] px-3 py-1.5 rounded border border-white/[0.06]">rs_live_••••••••••••••••</code>
            <button className="text-[10px] font-mono text-[#06B6D4]/50 hover:text-[#06B6D4] transition-colors">Reveal</button>
          </div>
        </SettingRow>
        <div className="h-[1px] bg-white/[0.04]" />
        <SettingRow label="Rate Limit" description="API calls per minute for this organization.">
          <span className="text-[12px] font-mono text-white/45">1,200 / min</span>
        </SettingRow>
      </Section>

      <div className="bg-[#0A0C0F] border border-[#EF4444]/15 rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[#EF4444]/10 bg-[#EF4444]/[0.03]">
          <AlertTriangle className="w-4 h-4 text-[#EF4444]/60" />
          <span className="text-[13px] font-semibold text-[#EF4444]/70">Danger Zone</span>
        </div>
        <div className="p-5 space-y-4">
          <SettingRow label="Reset All Thresholds" description="Revert all alert and scoring thresholds to factory defaults.">
            <button className="px-4 py-1.5 rounded-lg border border-[#EF4444]/20 text-[#EF4444]/60 text-[11px] font-mono hover:bg-[#EF4444]/[0.06] hover:text-[#EF4444] transition-all">Reset</button>
          </SettingRow>
          <div className="h-[1px] bg-[#EF4444]/[0.07]" />
          <SettingRow label="Clear Scout History" description="Permanently delete all scout reports and discovery history. This cannot be undone.">
            <button className="px-4 py-1.5 rounded-lg border border-[#EF4444]/20 text-[#EF4444]/60 text-[11px] font-mono hover:bg-[#EF4444]/[0.06] hover:text-[#EF4444] transition-all">Clear</button>
          </SettingRow>
          <div className="h-[1px] bg-[#EF4444]/[0.07]" />
          <SettingRow label="Disable Rocksteady System" description="Take Rocksteady offline. Signal scanning stops immediately. Requires executive authorization.">
            <button className="px-4 py-1.5 rounded-lg bg-[#EF4444]/[0.08] border border-[#EF4444]/25 text-[#EF4444] text-[11px] font-mono hover:bg-[#EF4444]/[0.15] transition-all">Disable System</button>
          </SettingRow>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button className="px-5 py-2.5 rounded-xl border border-white/[0.08] text-[12px] text-white/30 hover:text-white/55 hover:border-white/[0.14] transition-all">
          Discard Changes
        </button>
        <button className="px-5 py-2.5 rounded-xl bg-[#06B6D4]/[0.12] border border-[#06B6D4]/25 text-[#06B6D4] text-[12px] font-semibold hover:bg-[#06B6D4]/[0.18] transition-all">
          Save Settings
        </button>
      </div>
    </div>
  );
}
