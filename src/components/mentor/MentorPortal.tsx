import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  CheckCircle2,
  PlusCircle,
  Building2,
  Mail,
  Send,
  Sparkles,
  Award,
  MessageSquare,
  X,
  Star,
} from 'lucide-react';
import { COHORT_STUDENTS_LIST } from '../../data/seedProfiles';
import { useApp } from '../../context/AppContext';

export const MentorPortal: React.FC = () => {
  const { addMentorFeedback, mentorFeedbacks } = useApp();
  const [showPostForm, setShowPostForm] = useState(false);
  const [postedSuccess, setPostedSuccess] = useState(false);
  const [invitedStudentIds, setInvitedStudentIds] = useState<string[]>([]);
  const [activeFeedbackStudent, setActiveFeedbackStudent] = useState<typeof COHORT_STUDENTS_LIST[0] | null>(null);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [endorsedSkillInput, setEndorsedSkillInput] = useState('Wiring & Earthing, Industrial Electrical Safety & PPE');
  const [mentorRating, setMentorRating] = useState(5);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const [newPosting, setNewPosting] = useState({
    title: 'Diploma Trainee - Electrical Automation',
    company: 'Schneider Electric / Tata AutoComp',
    stream: 'Electrical',
    type: 'NAPS Apprenticeship',
    location: 'Chakan, Pune',
    stipend: '₹17,500 / month',
    requiredSkills: 'PLC Ladder Logic, Electrical Safety, Motor Testing',
  });

  const handleInvite = (studentId: string) => {
    setInvitedStudentIds((prev) => [...prev, studentId]);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    setPostedSuccess(true);
    setTimeout(() => {
      setShowPostForm(false);
      setPostedSuccess(false);
    }, 2500);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Mentor Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#1F4E79] text-xs font-bold mb-2">
              <Briefcase className="w-3.5 h-3.5 text-[#F28C28]" />
              <span>Industry Recruiter & Mentorship Portal</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Talent Sourcing & Candidate Matching
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Connect directly with vocational candidates verified through faculty-reviewed assessments.
              Filter students strictly by their audited skill levels.
            </p>
          </div>

          <button
            onClick={() => setShowPostForm(!showPostForm)}
            className="px-4 py-2.5 rounded-xl bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs flex items-center gap-2 transition-all self-start md:self-center shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-[#F28C28]" />
            <span>{showPostForm ? 'Close Form' : 'Post New Apprenticeship / Job'}</span>
          </button>
        </div>
      </div>

      {/* Post Role Form */}
      {showPostForm && (
        <form
          onSubmit={handleCreatePost}
          className="bg-white rounded-2xl p-6 border border-blue-200 shadow-sm space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-slate-900">
              Create New Verified Role Opening
            </h3>
            <span className="text-xs text-slate-400">Section 7.3 Mentor Flow</span>
          </div>

          {postedSuccess ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#2E8B57] mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">Opening Published Successfully!</h4>
              <p className="text-xs text-slate-500">
                Matched students with verified scores will receive instant notifications in their portal.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Job / Apprenticeship Title</label>
                <input
                  type="text"
                  required
                  value={newPosting.title}
                  onChange={(e) => setNewPosting({ ...newPosting, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Hiring Organization</label>
                <input
                  type="text"
                  required
                  value={newPosting.company}
                  onChange={(e) => setNewPosting({ ...newPosting, company: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Location & Plant Site</label>
                <input
                  type="text"
                  required
                  value={newPosting.location}
                  onChange={(e) => setNewPosting({ ...newPosting, location: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Monthly Stipend / Salary</label>
                <input
                  type="text"
                  required
                  value={newPosting.stipend}
                  onChange={(e) => setNewPosting({ ...newPosting, stipend: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">
                  Required Verified Competencies (comma separated)
                </label>
                <input
                  type="text"
                  required
                  value={newPosting.requiredSkills}
                  onChange={(e) => setNewPosting({ ...newPosting, requiredSkills: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPostForm(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs"
                >
                  Publish Role to Matching Engine
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      {/* Verified Candidates Directory */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#1F4E79]" />
              <span>Candidates Ranked by Verified Skill Alignment</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Only faculty-tested, verified skill scores are presented to industry recruiters.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-[#2E8B57]">
            Verified Pool (DPDP 2023 Compliant)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COHORT_STUDENTS_LIST.slice(0, 6).map((student) => {
            const isInvited = invitedStudentIds.includes(student.id);

            return (
              <div
                key={student.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all bg-slate-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-sm text-slate-900">{student.name}</span>
                    <span className="text-xs font-black text-[#1F4E79] bg-blue-100 px-2 py-0.5 rounded-full">
                      {student.readiness}% Fit
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    {student.education} • {student.branch} • Target: <span className="font-semibold text-slate-800">{student.targetRole}</span>
                  </p>

                  <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E8B57]" />
                    <span>Verified competencies: Wiring, Safety Standards, Diagnostics</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs gap-2">
                  <button
                    onClick={() => {
                      setActiveFeedbackStudent(student);
                      setFeedbackNote('');
                      setFeedbackSuccess(false);
                    }}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 hover:border-[#1F4E79] text-slate-700 font-bold text-[11px] flex items-center gap-1 hover:bg-white"
                  >
                    <Award className="w-3.5 h-3.5 text-[#F28C28]" />
                    <span>Endorse Skills</span>
                  </button>

                  {isInvited ? (
                    <span className="font-bold text-[#2E8B57] flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Interview Sent</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleInvite(student.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>Invite</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mentor Feedback & Endorsement Modal */}
      {activeFeedbackStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveFeedbackStudent(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-[#F28C28]" />
              <h3 className="font-black text-base text-slate-900">
                Endorse Competencies for {activeFeedbackStudent.name}
              </h3>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Your verified endorsement will be stamped onto this candidate's profile and stored permanently.
            </p>

            {feedbackSuccess ? (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2 py-6">
                <CheckCircle2 className="w-10 h-10 text-[#2E8B57] mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">Feedback & Endorsement Stamped!</h4>
                <p className="text-xs text-slate-500">
                  Candidate's SkillSetu vector has been updated with your verified industry endorsement.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addMentorFeedback({
                    studentId: activeFeedbackStudent.id,
                    studentName: activeFeedbackStudent.name,
                    mentorName: 'Vikram Deshmukh',
                    company: 'Tata AutoComp Systems Ltd',
                    role: 'Lead Automation Engineer',
                    notes: feedbackNote || 'Verified strong practical discipline during technical interview.',
                    endorsedSkills: endorsedSkillInput.split(',').map((s) => s.trim()).filter(Boolean),
                    rating: mentorRating,
                  });
                  setFeedbackSuccess(true);
                  setTimeout(() => {
                    setActiveFeedbackStudent(null);
                    setFeedbackSuccess(false);
                  }, 1800);
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Endorsed Technical Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={endorsedSkillInput}
                    onChange={(e) => setEndorsedSkillInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                    placeholder="Wiring & Earthing, Industrial Electrical Safety & PPE"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Mentor Rating & Recommendation
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setMentorRating(star)}
                        className={`p-1.5 rounded-lg ${
                          star <= mentorRating ? 'text-[#F28C28]' : 'text-slate-300'
                        }`}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    ))}
                    <span className="text-slate-500 font-bold ml-1">{mentorRating} / 5 Stars</span>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Practical Evaluation Notes
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={feedbackNote}
                    onChange={(e) => setFeedbackNote(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                    placeholder="Candidate demonstrated clean circuit reading, safety compliance, and good problem solving..."
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveFeedbackStudent(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#1F4E79] text-white font-bold"
                  >
                    Save & Endorse
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

