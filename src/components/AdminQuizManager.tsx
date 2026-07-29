import React, { useState } from 'react';
import { uploadFileToServer } from '../utils/upload';
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Play,
  CheckCircle2,
  XCircle,
  Upload,
  X,
  Sparkles,
  Sliders,
  ShoppingBag,
  ListFilter,
  Check,
  ChevronRight,
  Settings,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { QuizQuestion, QuizOption } from '../types/store';

interface AdminQuizManagerProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminQuizManager: React.FC<AdminQuizManagerProps> = ({ showToast }) => {
  const { quizQuestions, products, addQuizQuestion, updateQuizQuestion, deleteQuizQuestion, setAllQuizQuestions } = useStore();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);

  // Quiz Simulator Test Runner Modal
  const [isTestSimulatorOpen, setIsTestSimulatorOpen] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [simAnswers, setSimAnswers] = useState<Record<string, QuizOption>>({});
  const [simResult, setSimResult] = useState<any | null>(null);

  // Delete Modal
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionSubtitle, setQuestionSubtitle] = useState('');
  const [type, setType] = useState<'single' | 'multiple' | 'text' | 'image'>('single');
  const [options, setOptions] = useState<QuizOption[]>([
    { text: 'Option 1', dosha: 'Vata', hairType: 'Dry & Frizzy' },
    { text: 'Option 2', dosha: 'Pitta', hairType: 'Thinning' },
    { text: 'Option 3', dosha: 'Kapha', hairType: 'Oily & Scalp Flakes' },
  ]);

  // Conditional Logic state
  const [dependsOnQuestionId, setDependsOnQuestionId] = useState('');
  const [dependsOnOptionIndex, setDependsOnOptionIndex] = useState<number | ''>('');

  const resetForm = () => {
    setEditingQuestion(null);
    setQuestionTitle('');
    setQuestionSubtitle('');
    setType('single');
    setOptions([
      { text: 'Option 1', dosha: 'Vata', hairType: 'Dry & Frizzy' },
      { text: 'Option 2', dosha: 'Pitta', hairType: 'Thinning' },
      { text: 'Option 3', dosha: 'Kapha', hairType: 'Oily & Scalp Flakes' },
    ]);
    setDependsOnQuestionId('');
    setDependsOnOptionIndex('');
    setIsModalOpen(false);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (q: QuizQuestion) => {
    setEditingQuestion(q);
    setQuestionTitle(q.question || '');
    setQuestionSubtitle(q.subtitle || '');
    setType(q.type || 'single');
    setOptions(q.options || []);
    setDependsOnQuestionId(q.conditionalLogic?.dependsOnQuestionId || '');
    setDependsOnOptionIndex(
      q.conditionalLogic?.dependsOnOptionIndex !== undefined ? q.conditionalLogic.dependsOnOptionIndex : ''
    );
    setIsModalOpen(true);
  };

  // Option Handlers
  const handleAddOption = () => {
    setOptions([
      ...options,
      { text: `Option ${options.length + 1}`, dosha: 'Vata', hairType: 'Normal' },
    ]);
  };

  const handleUpdateOption = (index: number, partial: Partial<QuizOption>) => {
    setOptions(options.map((opt, i) => (i === index ? { ...opt, ...partial } : opt)));
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 1) {
      showToast('A question must have at least one option.', 'error');
      return;
    }
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionImageRead = async (index: number, file: File) => {
    try {
      const url = await uploadFileToServer(file);
      handleUpdateOption(index, { image: url });
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          handleUpdateOption(index, { image: e.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionTitle.trim()) {
      showToast('Please enter question title.', 'error');
      return;
    }

    const payload = {
      question: questionTitle,
      subtitle: questionSubtitle,
      type,
      options,
      conditionalLogic: dependsOnQuestionId
        ? {
            dependsOnQuestionId,
            dependsOnOptionIndex: Number(dependsOnOptionIndex) || 0,
          }
        : undefined,
    };

    if (editingQuestion) {
      updateQuizQuestion(editingQuestion.id, payload);
      showToast('Quiz question updated.', 'success');
    } else {
      addQuizQuestion(payload);
      showToast('New Quiz question added.', 'success');
    }

    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteQuizQuestion(id);
    showToast('Quiz question removed.', 'info');
    setDeleteId(null);
  };

  const handleMove = (index: number, direction: 'UP' | 'DOWN') => {
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= quizQuestions.length) return;

    const nextList = [...quizQuestions];
    const [moved] = nextList.splice(index, 1);
    nextList.splice(targetIndex, 0, moved);

    setAllQuizQuestions(nextList);
    showToast('Question order updated.', 'info');
  };

  // Quiz Test Simulator Functions
  const handleStartSimulator = () => {
    setSimStep(0);
    setSimAnswers({});
    setSimResult(null);
    setIsTestSimulatorOpen(true);
  };

  const handleSelectSimAnswer = (qId: string, opt: QuizOption) => {
    const newAnswers = { ...simAnswers, [qId]: opt };
    setSimAnswers(newAnswers);

    if (simStep < quizQuestions.length - 1) {
      setSimStep(simStep + 1);
    } else {
      // Calculate Result
      const doshaCounts: Record<string, number> = { Vata: 0, Pitta: 0, Kapha: 0 };
      (Object.values(newAnswers) as QuizOption[]).forEach((ans) => {
        if (ans.dosha && doshaCounts[ans.dosha] !== undefined) {
          doshaCounts[ans.dosha]++;
        }
      });

      const primaryDosha = Object.keys(doshaCounts).reduce((a, b) =>
        doshaCounts[a] > doshaCounts[b] ? a : b
      );

      setSimResult({
        primaryDosha,
        doshaCounts,
        recommendedProduct: products[0] || null,
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="text-[var(--brand-gold)] text-xs font-bold uppercase tracking-wider block mb-1 font-sans">
            AI Ayurvedic Diagnostics Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-slate-100">
            AI Quiz Questions & Logic Manager
          </h1>
          <p className="text-xs text-slate-300 font-sans mt-1">
            Build diagnostic questions, assign Dosha scores, and configure custom product mapping.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleStartSimulator}
            className="bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/50 text-[var(--brand-gold)] px-4 py-2.5 rounded-xl font-bold hover:bg-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] transition-all text-xs flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Test Quiz Simulator</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-5 py-2.5 rounded-xl font-bold hover:bg-white transition-all shadow-lg text-xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Question</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-xl p-4 space-y-1">
          <span className="text-xs text-slate-400 block">Total Questions</span>
          <span className="text-2xl font-bold font-serif-luxury text-slate-100">{quizQuestions.length}</span>
        </div>
        <div className="bg-[var(--brand-primary-deep)] border border-emerald-500/20 rounded-xl p-4 space-y-1">
          <span className="text-xs text-emerald-400 block">Dosha Diagnostic Engine</span>
          <span className="text-sm font-bold text-emerald-300 block">Vata • Pitta • Kapha</span>
        </div>
        <div className="bg-[var(--brand-primary-deep)] border border-[var(--brand-gold)]/30 rounded-xl p-4 space-y-1">
          <span className="text-xs text-[var(--brand-gold)] block">Recommendation Engine</span>
          <span className="text-sm font-bold text-[var(--brand-gold)] block">Auto Product Match Active</span>
        </div>
      </div>

      {/* Questions List */}
      {quizQuestions.length === 0 ? (
        <div className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-2xl p-12 text-center space-y-3">
          <HelpCircle className="w-12 h-12 text-slate-500 mx-auto opacity-50" />
          <h3 className="text-lg font-bold font-serif-luxury text-slate-200">No Quiz Questions Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click "Add New Question" above to configure your first diagnostic step.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {quizQuestions.map((q, index) => (
            <div
              key={q.id}
              className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-xl p-5 hover:border-[var(--brand-gold)]/40 transition-all shadow-md space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/40 text-[var(--brand-gold)] flex items-center justify-center font-bold text-xs shrink-0">
                    Q{index + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 font-serif-luxury">{q.question}</h3>
                    {q.subtitle && <p className="text-xs text-slate-400 font-sans">{q.subtitle}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-[var(--brand-primary-dark)] text-[var(--brand-gold)] border border-[var(--brand-gold)]/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    Type: {q.type || 'Single Choice'}
                  </span>
                  {q.conditionalLogic && (
                    <span className="bg-amber-950 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      Conditional Logic
                    </span>
                  )}
                </div>
              </div>

              {/* Options Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {q.options?.map((opt, optIdx) => (
                  <div
                    key={optIdx}
                    className="bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl p-3 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-200 block">{opt.text}</span>
                      <span className="text-[10px] text-[var(--brand-gold)] font-sans">
                        Dosha: {opt.dosha || 'Vata'} {opt.hairType ? `• ${opt.hairType}` : ''}
                      </span>
                    </div>
                    {opt.image && (
                      <img src={opt.image} alt="Option thumbnail" className="w-8 h-8 rounded-lg object-cover border" />
                    )}
                  </div>
                ))}
              </div>

              {/* Controls Footer */}
              <div className="pt-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMove(index, 'UP')}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg border border-white/15 text-slate-300 hover:bg-white/10 disabled:opacity-30"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(index, 'DOWN')}
                    disabled={index === quizQuestions.length - 1}
                    className="p-1.5 rounded-lg border border-white/15 text-slate-300 hover:bg-white/10 disabled:opacity-30"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(q)}
                    className="p-1.5 rounded-lg border border-white/15 text-slate-300 hover:bg-white/10"
                    title="Edit Question"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(q.id)}
                    className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-950"
                    title="Delete Question"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Question Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--brand-primary-deep)] border border-[var(--brand-gold)]/40 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 my-8">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[var(--brand-primary-dark)]">
              <h3 className="text-lg font-bold font-serif-luxury text-slate-100">
                {editingQuestion ? 'Edit Quiz Question' : 'Create Diagnostic Question'}
              </h3>
              <button onClick={resetForm} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Question Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Question Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. What is your primary scalp condition?"
                    value={questionTitle}
                    onChange={(e) => setQuestionTitle(e.target.value)}
                    className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                </div>

                {/* Question Subtitle */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Subtitle / Hint</label>
                  <input
                    type="text"
                    placeholder="e.g. Select the answer that best describes your daily observation"
                    value={questionSubtitle}
                    onChange={(e) => setQuestionSubtitle(e.target.value)}
                    className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                </div>
              </div>

              {/* Type Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Answer UI Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                >
                  <option value="single">Single Choice Cards</option>
                  <option value="multiple">Multiple Choice Checklist</option>
                  <option value="image">Visual Image Option Cards</option>
                </select>
              </div>

              {/* Options List Builder */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-300">Answer Options & Dosha Mapping</label>
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] border border-[var(--brand-gold)]/40 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Option</span>
                  </button>
                </div>

                {options.map((opt, optIdx) => (
                  <div
                    key={optIdx}
                    className="bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl p-4 space-y-3 relative group"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">Option Text</label>
                        <input
                          type="text"
                          required
                          value={opt.text}
                          onChange={(e) => handleUpdateOption(optIdx, { text: e.target.value })}
                          className="w-full bg-[var(--brand-primary-deep)] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">Mapped Dosha</label>
                        <select
                          value={opt.dosha || 'Vata'}
                          onChange={(e) => handleUpdateOption(optIdx, { dosha: e.target.value })}
                          className="w-full bg-[var(--brand-primary-deep)] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                        >
                          <option value="Vata">Vata (Dry, Frizzy, Thin)</option>
                          <option value="Pitta">Pitta (Scalp Heat, Premature Greying)</option>
                          <option value="Kapha">Kapha (Excess Oil, Flakes, Heaviness)</option>
                          <option value="Tridoshic">Tridoshic (Balanced All Types)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">Hair Concern Tag</label>
                        <input
                          type="text"
                          placeholder="e.g. Dry Scalp"
                          value={opt.hairType || ''}
                          onChange={(e) => handleUpdateOption(optIdx, { hairType: e.target.value })}
                          className="w-full bg-[var(--brand-primary-deep)] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                        />
                      </div>
                    </div>

                    {/* Image Option Support */}
                    {type === 'image' && (
                      <div className="flex items-center gap-3 pt-1">
                        {opt.image && (
                          <img src={opt.image} alt="Opt" className="w-12 h-12 rounded-lg object-cover border" />
                        )}
                        <label className="bg-[var(--brand-primary-deep)] border border-dashed border-[var(--brand-gold)]/50 text-[var(--brand-gold)] text-[11px] font-bold px-3 py-1 rounded-lg cursor-pointer">
                          <span>Upload Option Card Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              e.target.files?.[0] && handleOptionImageRead(optIdx, e.target.files[0])
                            }
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveOption(optIdx)}
                      className="absolute top-2 right-2 text-slate-500 hover:text-rose-400 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Conditional Logic Section */}
              <div className="bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl p-4 space-y-3">
                <span className="text-[var(--brand-gold)] text-xs font-bold uppercase tracking-wider block">
                  Conditional Display Logic (Optional)
                </span>
                <p className="text-[11px] text-slate-400">
                  Only show this question if a specific answer was selected in a previous step.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 mb-1">Depends on Question</label>
                    <select
                      value={dependsOnQuestionId}
                      onChange={(e) => setDependsOnQuestionId(e.target.value)}
                      className="w-full bg-[var(--brand-primary-deep)] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                    >
                      <option value="">Always Show (No Condition)</option>
                      {quizQuestions
                        .filter((q) => q.id !== editingQuestion?.id)
                        .map((q, idx) => (
                          <option key={q.id} value={q.id}>
                            Q{idx + 1}: {q.question.slice(0, 30)}...
                          </option>
                        ))}
                    </select>
                  </div>

                  {dependsOnQuestionId && (
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">When Option Index Equals</label>
                      <input
                        type="number"
                        placeholder="e.g. 0 for 1st Option"
                        value={dependsOnOptionIndex}
                        onChange={(e) => setDependsOnOptionIndex(Number(e.target.value))}
                        className="w-full bg-[var(--brand-primary-deep)] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-xl border border-white/20 text-slate-300 hover:bg-white/10 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-6 py-2 rounded-xl font-bold hover:bg-white transition-all text-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingQuestion ? 'Save Question' : 'Add Question'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quiz Interactive Simulator Modal */}
      {isTestSimulatorOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--brand-primary-deep)] border border-[var(--brand-gold)]/40 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[var(--brand-gold)] text-[10px] font-bold uppercase tracking-wider block">
                  Interactive Test Simulator
                </span>
                <h3 className="text-lg font-bold font-serif-luxury text-slate-100">Ayurvedic Hair Quiz Simulator</h3>
              </div>
              <button
                onClick={() => setIsTestSimulatorOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!simResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Question {simStep + 1} of {quizQuestions.length}</span>
                  <span className="text-[var(--brand-gold)]">Step {Math.round(((simStep + 1) / quizQuestions.length) * 100)}%</span>
                </div>

                <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[var(--brand-gold)] h-full transition-all duration-300"
                    style={{ width: `${((simStep + 1) / quizQuestions.length) * 100}%` }}
                  />
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-bold font-serif-luxury text-slate-100">
                    {quizQuestions[simStep]?.question}
                  </h4>
                  <p className="text-xs text-slate-300">{quizQuestions[simStep]?.subtitle}</p>
                </div>

                <div className="space-y-2 pt-2">
                  {quizQuestions[simStep]?.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectSimAnswer(quizQuestions[simStep].id, opt)}
                      className="w-full bg-[var(--brand-primary-dark)] border border-white/15 hover:border-[var(--brand-gold)] p-3 rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <span className="text-xs font-bold text-slate-200 group-hover:text-[var(--brand-gold)]">{opt.text}</span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[var(--brand-gold)]" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 py-4 animate-in zoom-in-95">
                <Sparkles className="w-12 h-12 text-[var(--brand-gold)] mx-auto animate-pulse" />
                <h3 className="text-2xl font-bold font-serif-luxury text-slate-100">
                  Dosha Result: {simResult.primaryDosha} Prakriti
                </h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Based on your responses, your scalp exhibits {simResult.primaryDosha} dominance requiring customized Hakki-Pikki herbal oils.
                </p>

                {simResult.recommendedProduct && (
                  <div className="bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/40 rounded-xl p-4 flex items-center gap-3 text-left">
                    <img
                      src={simResult.recommendedProduct.images[0]}
                      alt={simResult.recommendedProduct.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <span className="text-[10px] text-[var(--brand-gold)] font-bold block">RECOMMENDED REMEDY</span>
                      <h4 className="text-xs font-bold text-slate-100">{simResult.recommendedProduct.name}</h4>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleStartSimulator}
                  className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-6 py-2 rounded-xl text-xs font-bold hover:bg-white transition-all"
                >
                  Restart Test Run
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--brand-primary-deep)] border border-rose-500/30 rounded-2xl max-w-sm w-full p-6 space-y-4 animate-in zoom-in-95">
            <h3 className="text-lg font-bold font-serif-luxury text-slate-100">Delete Question?</h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to remove this diagnostic question?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl border border-white/20 text-slate-300 hover:bg-white/10 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="bg-rose-600 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-rose-700 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
