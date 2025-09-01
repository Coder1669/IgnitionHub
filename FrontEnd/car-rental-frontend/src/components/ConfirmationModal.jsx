import React from "react";
import { 
    AlertTriangle, 
    X,
    RefreshCw,
    CheckCircle,
    Trash2,
    Shield,
    Info
} from 'lucide-react';

const ConfirmationModal = ({
    show,
    onHide,
    onConfirm,
    title,
    body,
    confirmText = "Confirm",
    type = "danger", // danger, warning, info, success
    isLoading = false
}) => {
    const getTypeConfig = () => {
        switch (type) {
            case "danger":
                return {
                    icon: AlertTriangle,
                    iconBg: "bg-gradient-to-r from-red-600 to-red-700",
                    alertBg: "bg-red-500/20",
                    alertBorder: "border-red-500/50",
                    alertText: "text-red-200",
                    buttonBg: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
                    iconColor: "text-red-400",
                    actionIcon: Trash2
                };
            case "warning":
                return {
                    icon: AlertTriangle,
                    iconBg: "bg-gradient-to-r from-yellow-600 to-orange-600",
                    alertBg: "bg-yellow-500/20",
                    alertBorder: "border-yellow-500/50",
                    alertText: "text-yellow-200",
                    buttonBg: "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700",
                    iconColor: "text-yellow-400",
                    actionIcon: AlertTriangle
                };
            case "info":
                return {
                    icon: Info,
                    iconBg: "bg-gradient-to-r from-blue-600 to-purple-600",
                    alertBg: "bg-blue-500/20",
                    alertBorder: "border-blue-500/50",
                    alertText: "text-blue-200",
                    buttonBg: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
                    iconColor: "text-blue-400",
                    actionIcon: CheckCircle
                };
            case "success":
                return {
                    icon: CheckCircle,
                    iconBg: "bg-gradient-to-r from-green-600 to-green-700",
                    alertBg: "bg-green-500/20",
                    alertBorder: "border-green-500/50",
                    alertText: "text-green-200",
                    buttonBg: "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800",
                    iconColor: "text-green-400",
                    actionIcon: CheckCircle
                };
            default:
                return {
                    icon: AlertTriangle,
                    iconBg: "bg-gradient-to-r from-red-600 to-red-700",
                    alertBg: "bg-red-500/20",
                    alertBorder: "border-red-500/50",
                    alertText: "text-red-200",
                    buttonBg: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
                    iconColor: "text-red-400",
                    actionIcon: Trash2
                };
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            onHide();
        }
    };

    if (!show) return null;

    const config = getTypeConfig();
    const Icon = config.icon;
    const ActionIcon = config.actionIcon;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl w-full max-w-md transform transition-all duration-300">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/20">
                    <div className="flex items-center space-x-3">
                        <div className={`${config.iconBg} p-3 rounded-xl`}>
                            <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{title}</h2>
                            <p className="text-slate-300 text-sm">Please confirm your action</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    {/* Alert Message */}
                    <div className={`${config.alertBg} border ${config.alertBorder} rounded-xl p-4 mb-6`}>
                        <div className="flex items-start space-x-3">
                            <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
                            <div>
                                <p className={`${config.alertText} text-sm leading-relaxed`}>
                                    {body}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                        <button
                            onClick={handleClose}
                            disabled={isLoading}
                            className="px-6 py-3 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`px-6 py-3 ${config.buttonBg} disabled:from-slate-600 disabled:to-slate-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
                        >
                            {isLoading ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <ActionIcon className="w-4 h-4" />
                                    <span>{confirmText}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;